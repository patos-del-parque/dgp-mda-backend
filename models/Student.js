const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  DNI: { type: String, required: true },
  curso: { type: String, required: true },
  edad: { type: Number, required: true },
  niveles: { type: Number, required: true },
  password: { type: Number, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
