// Importa Mongoose para gestionar la conexión y el modelo de MongoDB.
import mongoose from "mongoose";
// Importa el esquema/modelo que permite consultar los cursos.
import Curso from "../models/Curso.js";

// Punto de entrada de la API: recibe la petición HTTP y construye la respuesta.
export default async function handler(req, res) {
  try {
    // Abre la conexión solo si todavía no existe una conexión activa.
    // Conectar a MongoDB Atlas si la conexión no está activa
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Lee los filtros opcionales enviados como parámetros de la URL.
    // Extraer parámetros opcionales desde la URL (?categoria=Backend&precioMax=50)
    const { categoria, precioMax, tag } = req.query;

    // Empieza mostrando únicamente cursos publicados; los filtros opcionales se añadirán después.
    // Construir el objeto de filtro dinámicamente
    const filtro = { publicado: true };

    // Si se indicó una categoría, limita los resultados a esa categoría.
    if (categoria) {
      filtro.categoria = categoria;
    }
    // Si se indicó un precio máximo, busca cursos con ese precio o uno inferior.
    if (precioMax) {
      filtro.precio = { $lte: Number(precioMax) };
    }
    // Si se indicó una etiqueta, busca cursos que la tengan (normalizada a minúsculas).
    if (tag) {
      filtro.etiquetas = { $in: [tag.toLowerCase()] };
    }

    // Consulta los cursos, selecciona los campos que se devolverán y los ordena por precio ascendente.
    // Ejecutar la consulta en Mongoose ordenada por precio ascendente
    const cursos = await Curso.find(filtro)
      .select(
        "codigo titulo categoria precio duracionHoras etiquetas instructor",
      )
      .sort({ precio: 1 });

    // Devuelve una respuesta HTTP 200 con el total, los filtros usados y los cursos encontrados.
    return res.status(200).json({
      total: cursos.length,
      filtrosAplicados: filtro,
      datos: cursos,
    });
  } catch (error) {
    // Si falla la conexión o la consulta, informa del error con estado HTTP 500.
    return res.status(500).json({
      error: "Error al consultar la base de datos",
      detalle: error.message,
    });
  }
}
