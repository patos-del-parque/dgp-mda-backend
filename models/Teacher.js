const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  password: { type: String, required: true },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;

