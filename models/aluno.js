const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let alunoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'Professor'
    },
    notas : [{
        type: Schema.Types.ObjectId,
        ref: 'Nota'
    }]
});

module.exports = mongoose.model('Aluno', alunoSchema);
