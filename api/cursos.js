// Importa Mongoose para gestionar la conexión y el modelo de MongoDB.
import mongoose from "mongoose";
// Importa el modelo que traduce las operaciones de Mongoose a consultas sobre la colección de cursos.
import Curso from "../models/Curso.js";

// Punto de entrada de la API: recibe la petición HTTP y construye una respuesta JSON.
export default async function handler(req, res) {
  try {
    // Abre la conexión solo si no existe una activa; evita reconectar en cada petición.
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Lee filtros opcionales de la URL, por ejemplo ?categoria=Backend&precioMax=50.
    const { categoria, precioMax, tag } = req.query;

    // El filtro base excluye borradores; las condiciones siguientes se agregan solo si se solicitan.
    const filtro = { publicado: true };

    // Añade una condición de igualdad para la categoría indicada.
    if (categoria) {
      filtro.categoria = categoria;
    }
    // $lte significa "menor o igual que"; Number convierte el parámetro de texto a número.
    if (precioMax) {
      filtro.precio = { $lte: Number(precioMax) };
    }
    // $in encuentra documentos cuyo arreglo de etiquetas contenga el valor indicado.
    if (tag) {
      filtro.etiquetas = { $in: [tag.toLowerCase()] };
    }

    // Busca los documentos coincidentes, limita los campos de salida y ordena por precio ascendente (1).
    const cursos = await Curso.find(filtro)
      .select(
        "codigo titulo categoria precio duracionHoras etiquetas instructor",
      )
      .sort({ precio: 1 });

    // Responde con estado 200 e incluye el total, el filtro aplicado y los resultados.
    return res.status(200).json({
      total: cursos.length,
      filtrosAplicados: filtro,
      datos: cursos,
    });
  } catch (error) {
    // Si falla la conexión o la consulta, devuelve un error HTTP 500 con el detalle disponible.
    return res.status(500).json({
      error: "Error al consultar la base de datos",
      detalle: error.message,
    });
  }
}
