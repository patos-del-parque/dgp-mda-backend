const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  aula: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true},
  lectura:{type: Boolean, default: false, required: true },
  imagen:{type: Boolean, default: false, required: true },
  video:{type: Boolean, default: false, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
