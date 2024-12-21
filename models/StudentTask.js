const mongoose = require('mongoose');

const studentTaskSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student',
        required: true
    },
    taskId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task',
        required: true
    },
    realizada: { 
        type: Boolean, 
        default: false
    },
    tipoVista: {
        type: String,
        required: true
    }
});

const StudentTask = mongoose.model('StudentTask', studentTaskSchema);

module.exports = StudentTask;