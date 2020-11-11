const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const path = require('path')

mongoose.Promise = global.Promise;

mongoose
    .connect('mongodb://localhost:27017/alumioapp_db', {})
    .then(function(){
        console.log("Conectado ao Banco de dados.");
    })
    .catch((error) => {
        console.log("Problema para estabelecer conexao com o banco de dados");
    });

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

//Configuração do mustache para as views
const mustacheExpressInstance = mustacheExpress();
mustacheExpressInstance.cache = null;
app.engine('mustache', mustacheExpressInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use('/', routes);

app.listen(3000, function(){
    console.log("Listening on port 3000.");
});

//Configurar diretório público
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));


//Iniciar servidor do db >>> C:\Program Files\MongoDB\Server\3.6\bin>mongod
//Executar aplicacao C:\AAI\AlumioApp>nodemon server.js
