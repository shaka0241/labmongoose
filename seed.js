// Importa Mongoose, el cargador de variables de entorno y el modelo de cursos.
import mongoose from "mongoose";
import dotenv from "dotenv";
import Curso from "./models/Curso.js";

// Carga la URI de conexión y otras variables del archivo .env.
dotenv.config();

// Datos de ejemplo que se insertarán en la colección para realizar las prácticas.
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

// Conecta a MongoDB, prepara los datos de ejemplo y demuestra las validaciones.
async function poblarBaseDeDatos() {
  try {
    // Abre la conexión a la base de datos usando la URI configurada.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB Atlas");

    // Vacía la colección antes de cargar los ejemplos, para evitar duplicados al repetir el script.
    // 1. Limpiar colección previa para evitar duplicados al repetir la práctica
    await Curso.deleteMany({});
    console.log("Colección anterior limpiada");

    // Inserta todos los cursos de ejemplo en una sola operación.
    // 2. Insertar el lote de cursos válidos
    const insertados = await Curso.insertMany(cursosIniciales);
    console.log(`Se insertaron ${insertados.length} cursos correctamente.`);

    // Intenta guardar un curso inválido para observar cómo Mongoose rechaza datos que no cumplen el esquema.
    // 3. Prueba pedagógica: Intentar insertar un curso que viola el Schema
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
      console.log("Mongoose bloqueó el documento inválido con éxito:");
      Object.values(errorValidacion.errors).forEach((err) => {
        console.log(` - Campo [${err.path}]: ${err.message}`);
      });
    }
  } catch (error) {
    // Informa de errores de conexión u otros errores generales durante la carga.
    console.error("Error general:", error.message);
  } finally {
    // Cierra la conexión al terminar, incluso si se produjo un error.
    await mongoose.disconnect();
    console.log("\nDesconectado de MongoDB Atlas");
  }
}

// Ejecuta la carga inicial al iniciar este archivo.
poblarBaseDeDatos();
