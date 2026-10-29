// Importa las herramientas para conectarse a MongoDB y cargar variables de entorno.
import mongoose from "mongoose";
import dotenv from "dotenv";
// Importa el modelo usado por todas las consultas de este laboratorio.
import Curso from "./models/Curso.js";

// Carga las variables definidas en el archivo .env, como la URI de MongoDB.
dotenv.config();

// Ejecuta ejemplos de lectura con distintos filtros y operadores de Mongoose.
async function ejecutarConsultas() {
  try {
    // Establece la conexión antes de hacer consultas.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("=== LABORATORIO DE CONSULTAS MONGOOSE ===\n");

    // CONSULTA 1: Filtro simple (Igualdad exacta)
    // Buscar solo los cursos que estén publicados y sean de categoría Frontend
    const cursosFrontend = await Curso.find({
      categoria: "Frontend",
      publicado: true,
    });
    console.log("1. Cursos Frontend publicados:", cursosFrontend.length);

    // CONSULTA 2: Operadores numéricos ($lte = menor o igual que)
    // Buscar cursos económicos (precio menor o igual a 40)
    const cursosEconomicos = await Curso.find({
      precio: { $lte: 40 },
    }).select("codigo titulo precio -_id");
    console.log(
      "\n2. Cursos por 40 EUR o menos (solo código, título y precio):",
    );
    console.table(cursosEconomicos.map((c) => c.toObject()));

    // CONSULTA 3: Búsqueda en arreglos y operador $in
    // Buscar cursos que contengan la etiqueta 'javascript' o 'nosql'
    const cursosPorTag = await Curso.find({
      etiquetas: { $in: ["javascript", "nosql"] },
    }).select("titulo etiquetas -_id");
    console.log("\n3. Cursos con etiqueta javascript o nosql:");
    console.log(cursosPorTag);

    // CONSULTA 4: Consulta en subdocumentos + Ordenamiento (.sort) + Límite (.limit)
    // Top 3 cursos más largos dictados por instructores con al menos 8 años de experiencia
    const cursosAvanzados = await Curso.find({
      "instructor.experienciaAnios": { $gte: 8 },
    })
      .sort({ duracionHoras: -1 }) // -1 = Descendente (de mayor a menor duración)
      .limit(3)
      .select("titulo duracionHoras instructor.nombre -_id");

    console.log(
      "\n4. Top cursos de instructores senior ordenados por duración:",
    );
    console.log(cursosAvanzados);

    // CONSULTA 5: Búsqueda única con findOne
    const cursoEspecifico = await Curso.findOne({ codigo: "MONGO-301" });
    console.log("\n5. Búsqueda exacta con findOne (MONGO-301):");
    console.log(
      `Título: ${cursoEspecifico.titulo} | Creado el: ${cursoEspecifico.createdAt}`,
    );
  } catch (error) {
    // Muestra un mensaje si alguna consulta o la conexión falla.
    console.error("Error en las consultas:", error.message);
  } finally {
    // Cierra la conexión tanto si las consultas terminan bien como si ocurre un error.
    await mongoose.disconnect();
  }
}

// Inicia el laboratorio al ejecutar este archivo.
ejecutarConsultas();
