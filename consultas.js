// Importa las herramientas para conectarse a MongoDB y cargar variables de entorno.
import mongoose from "mongoose";
import dotenv from "dotenv";
// Importa el modelo que proporciona los métodos de consulta de Mongoose para los cursos.
import Curso from "./models/Curso.js";

// Carga las variables definidas en .env, como la URI de conexión a MongoDB.
dotenv.config();

// Ejecuta varios ejemplos de lectura para comparar filtros y operadores de Mongoose.
async function ejecutarConsultas() {
  try {
    // Establece la conexión antes de consultar la colección.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("=== LABORATORIO DE CONSULTAS MONGOOSE ===\n");

    // CONSULTA 1: combina dos condiciones de igualdad; ambas deben cumplirse.
    const cursosFrontend = await Curso.find({
      categoria: "Frontend",
      publicado: true,
    });
    console.log("1. Cursos Frontend publicados:", cursosFrontend.length);

    // CONSULTA 2: $lte significa "menor o igual que"; select limita los campos devueltos.
    // El prefijo - excluye _id, que Mongoose incluye por defecto.
    const cursosEconomicos = await Curso.find({
      precio: { $lte: 40 },
    }).select("codigo titulo precio -_id");
    console.log(
      "\n2. Cursos por 40 EUR o menos (solo código, título y precio):",
    );
    // toObject convierte cada documento Mongoose en un objeto JavaScript para mostrarlo en tabla.
    console.table(cursosEconomicos.map((c) => c.toObject()));

    // CONSULTA 3: $in encuentra documentos cuya lista de etiquetas incluya cualquiera de estos valores.
    const cursosPorTag = await Curso.find({
      etiquetas: { $in: ["javascript", "nosql"] },
    }).select("titulo etiquetas -_id");
    console.log("\n3. Cursos con etiqueta javascript o nosql:");
    console.log(cursosPorTag);

    // CONSULTA 4: la ruta con punto accede a un campo de un subdocumento.
    // $gte significa "mayor o igual que"; sort(-1) ordena de mayor a menor y limit(3) conserva tres resultados.
    const cursosAvanzados = await Curso.find({
      "instructor.experienciaAnios": { $gte: 8 },
    })
      .sort({ duracionHoras: -1 })
      .limit(3)
      .select("titulo duracionHoras instructor.nombre -_id");

    console.log(
      "\n4. Top cursos de instructores senior ordenados por duración:",
    );
    console.log(cursosAvanzados);

    // CONSULTA 5: findOne devuelve el primer documento coincidente (o null si no existe).
    // En este ejemplo, MONGO-301 se inserta en seed.js.
    const cursoEspecifico = await Curso.findOne({ codigo: "MONGO-301" });
    console.log("\n5. Búsqueda exacta con findOne (MONGO-301):");
    console.log(
      `Título: ${cursoEspecifico.titulo} | Creado el: ${cursoEspecifico.createdAt}`,
    );
  } catch (error) {
    // Informa si la conexión o cualquiera de las consultas produce un error.
    console.error("Error en las consultas:", error.message);
  } finally {
    // finally se ejecuta tanto si el bloque try termina bien como si lanza un error.
    await mongoose.disconnect();
  }
}

// Inicia el laboratorio cuando se ejecuta este archivo con Node.js.
ejecutarConsultas();
