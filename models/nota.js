const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let notaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Nota', notaSchema);
