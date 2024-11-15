const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  password: { type: Number, required: true },
  curso: { type: String, required: true },
  niveles: { type: Number, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
