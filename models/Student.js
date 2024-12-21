const mongoose = require('mongoose');

/**
 * Esquema de un estudiante en la base de datos MongoDB.
 * 
 * @typedef {Object} Student
 * @property {string} nombre - El nombre del estudiante. Es un campo requerido.
 * @property {string} aula - El aula asignada al estudiante. Es un campo requerido.
 * @property {string} password - La contraseña del estudiante. Es un campo requerido.
 * @property {string} avatar - La URL del avatar del estudiante. Es un campo requerido.
 * @property {boolean} lectura - Indica si el estudiante ha completado la actividad de lectura. 
 *  El valor por defecto es `false` y es un campo requerido.
 * @property {boolean} imagen - Indica si el estudiante ha completado la actividad de imagen. 
 *  El valor por defecto es `false` y es un campo requerido.
 * @property {boolean} video - Indica si el estudiante ha completado la actividad de video. 
 *  El valor por defecto es `false` y es un campo requerido.
 */

/**
 * Modelo de Mongoose para el esquema de un estudiante.
 * 
 * Este modelo se utiliza para interactuar con la colección 'students' en la base de datos MongoDB.
 * Los campos incluyen nombre, aula, contraseña, avatar y las actividades completadas (lectura, imagen, video).
 * 
 * @type {mongoose.Model<Student>}
 */
const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  aula: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  lectura: { type: Boolean, default: false, required: true },
  imagen: { type: Boolean, default: false, required: true },
  video: { type: Boolean, default: false, required: true },
  comedor: { type: Boolean, default: false, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
