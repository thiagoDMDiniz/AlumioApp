const mongoose = require('mongoose');
const Aluno = require('./aluno');
const Schema = mongoose.Schema;

let professorSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    materia: {
        type: String,
        required: true
    },
    alunos: [{
        type: Schema.Types.ObjectId,
        ref: 'Aluno'
    }]
});

module.exports = mongoose.model('Professor', professorSchema);
