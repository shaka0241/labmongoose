// Importa Mongoose para definir el esquema y registrar el modelo.
import mongoose from "mongoose";

// Define la estructura de los documentos de cursos y las reglas de validación.
const cursoSchema = new mongoose.Schema(
  {
    // Código único del curso; se guarda en mayúsculas y sin espacios externos.
    codigo: {
      type: String,
      required: [true, "El código del curso es obligatorio"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    // Título obligatorio con una longitud mínima y sin espacios externos.
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [5, "El título debe tener al menos 5 caracteres"],
    },
    // Categoría obligatoria restringida a las opciones permitidas.
    categoria: {
      type: String,
      required: true,
      enum: {
        values: ["Frontend", "Backend", "DevOps", "Base de Datos"],
        message: "{VALUE} no es una categoría válida",
      },
    },
    // Precio numérico no negativo; si no se especifica, comienza en cero.
    precio: {
      type: Number,
      required: true,
      min: [0, "El precio no puede ser negativo"],
      default: 0,
    },
    // Duración del curso expresada en horas; debe ser al menos una hora.
    duracionHoras: {
      type: Number,
      required: true,
      min: 1,
    },
    // Lista de etiquetas asociadas al curso; por defecto no contiene ninguna.
    etiquetas: {
      type: [String],
      default: [],
    },
    // Datos del instructor guardados como subdocumento del curso.
    instructor: {
      nombre: { type: String, required: true },
      experienciaAnios: { type: Number, min: 1 },
    },
    // Indica si el curso está publicado; por defecto se considera publicado.
    publicado: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Añade automáticamente las fechas de creación y de última actualización.
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  },
);

// Reutiliza el modelo si ya está registrado, o lo crea a partir del esquema.
// Evita recompilar el modelo si ya existe en entornos Serverless como Vercel
const Curso = mongoose.models.Curso || mongoose.model("Curso", cursoSchema);

// Exporta el modelo para que otros archivos puedan crear y consultar cursos.
export default Curso;
