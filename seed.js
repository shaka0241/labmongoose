// Importa la conexión de MongoDB, el cargador de variables y el modelo de cursos.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Curso from "./models/Curso.js";

// Carga la URI de conexión y otras variables del archivo .env.
dotenv.config();

// Documentos de ejemplo para probar las consultas y validaciones del laboratorio.
// instructor es un subdocumento y etiquetas es un arreglo de valores de texto.
const cursosIniciales = [
  {
    codigo: "MERN-101",
    titulo: "Fundamentos de React y Estado Moderno",
    categoria: "Frontend",
    precio: 39.99,
    duracionHoras: 18,
    etiquetas: ["react", "javascript", "hooks", "ui"],
    instructor: { nombre: "Laura Gómez", experienciaAnios: 6 },
    publicado: true,
  },
  {
    codigo: "NODE-202",
    titulo: "APIs RESTful con Node.js y Express",
    categoria: "Backend",
    precio: 49.99,
    duracionHoras: 24,
    etiquetas: ["node", "express", "api", "javascript"],
    instructor: { nombre: "Carlos Ruiz", experienciaAnios: 8 },
    publicado: true,
  },
  {
    codigo: "MONGO-301",
    titulo: "Modelado de Datos con MongoDB y Mongoose",
    categoria: "Base de Datos",
    precio: 29.5,
    duracionHoras: 12,
    etiquetas: ["mongodb", "mongoose", "nosql", "node"],
    instructor: { nombre: "Carlos Ruiz", experienciaAnios: 8 },
    publicado: true,
  },
  {
    codigo: "DEVOPS-401",
    titulo: "Despliegue Continuo en Vercel y Docker",
    categoria: "DevOps",
    precio: 59.0,
    duracionHoras: 15,
    etiquetas: ["docker", "vercel", "ci-cd"],
    instructor: { nombre: "Elena Martín", experienciaAnios: 10 },
    publicado: true,
  },
  {
    codigo: "NEXT-501",
    titulo: "Arquitectura Fullstack con Next.js (Borrador)",
    categoria: "Frontend",
    precio: 65.0,
    duracionHoras: 30,
    etiquetas: ["nextjs", "react", "ssr"],
    instructor: { nombre: "Laura Gómez", experienciaAnios: 6 },
    publicado: false,
  },
];

// Conecta a MongoDB, reinicia los datos de ejemplo y demuestra las validaciones del esquema.
async function poblarBaseDeDatos() {
  try {
    // Abre la conexión a la base de datos usando la URI configurada en .env.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB Atlas");

    // Elimina todos los cursos existentes para que cada ejecución parta del mismo conjunto de datos.
    // Atención: esta operación borra el contenido actual de la colección.
    await Curso.deleteMany({});
    console.log("Colección anterior limpiada");

    // Inserta el arreglo completo; Mongoose valida cada documento antes de guardarlo.
    const insertados = await Curso.insertMany(cursosIniciales);
    console.log(`Se insertaron ${insertados.length} cursos correctamente.`);

    // Intenta guardar un curso que incumple varias reglas para observar los errores de validación.
    console.log("\n--- Probando el escudo de validación de Mongoose ---");
    try {
      await Curso.create({
        codigo: "ERR-999",
        titulo: "JS", // Falla: menos de 5 caracteres
        categoria: "Diseño Gráfico", // Falla: no está en el enum
        precio: -15, // Falla: precio negativo
        duracionHoras: 10,
        instructor: { nombre: "Pedro" },
      });
    } catch (errorValidacion) {
      // Recorre los errores por campo para mostrar qué regla rechazó cada dato.
      console.log("Mongoose bloqueó el documento inválido con éxito:");
      Object.values(errorValidacion.errors).forEach((err) => {
        console.log(` - Campo [${err.path}]: ${err.message}`);
      });
    }
  } catch (error) {
    // Informa de errores generales, como fallos de conexión o inserción de los datos iniciales.
    console.error("Error general:", error.message);
  } finally {
    // Cierra la conexión incluso si una operación anterior falla.
    await mongoose.disconnect();
    console.log("\nDesconectado de MongoDB Atlas");
  }
}

// Ejecuta la preparación de datos al iniciar este archivo con Node.js.
poblarBaseDeDatos();
