const router = require('express').Router();
var async = require('async');
const Aluno = require('../models/aluno'); //Importação do model de aluno
const Professor = require('../models/professor'); //Importação do model de professor
const Nota = require('../models/nota'); //Importação do model de nota


//Listar todos alunos
router.get('/', function(req, res){
    var listaAlunos = Aluno.find({}).populate({path: 'professor', select: 'nome'});
    var listaProfessores = Professor.find({});

    var resources = {
        alunos : listaAlunos.exec.bind(listaAlunos),
        professores : listaProfessores.exec.bind(listaProfessores)
    }

    async.parallel(resources, function(err, results){
        if(err){
            res.status(500).send(err);
            return;
        }
        res.render('index', results);
    });
});

//Listar aluno específico
router.get('/aluno/:_id', function(req, res){

    let id = req.params._id;

    var alunoPopulateQuery = [
            {
                path:'professor',
                select:'nome'
            },
            {
                path:'notas',
                model: 'Nota'
            }
        ];

    var listaAlunos = Aluno.find({"_id": id}).populate(alunoPopulateQuery);
    var listaProfessores = Professor.find({});
    var listaTodasNotas = Nota.find({});

    var resources = {
        alunos : listaAlunos.exec.bind(listaAlunos),
        professores : listaProfessores.exec.bind(listaProfessores),
        todasNotas : listaTodasNotas.exec.bind(listaTodasNotas)
    }

    async.parallel(resources, function(err, results){
        if(err){
            res.status(500).send(err);
            return;
        }
        res.render('aluno', results);
    });
});

//Adicionar novo aluno
router.post('/alunos', function(req, res){

    let nome = req.body.nome;

    Professor.findOne({"_id": req.body.professor}).then(function(results){
        let professor = results;

        let newAluno = new Aluno({nome: nome, professor: professor._id});

        Professor.update({ _id: professor._id }, {$push:{alunos: newAluno._id}}, function(){

            newAluno.save()
                .then(function(){
                    res.redirect('/');
                }).catch(function(err){
                    console.log(err);
                    res.redirect('/');
                });

        });
    });
});

//Trata get
router.get('/alunos', function(req, res){
    res.render('nao-encontrado');
});


//Adicionar nota sobre aluno
router.post('/aluno/:_id/adicionarnota', function(req, res){

    let idAluno = req.params._id
    let idNota = req.body.nota;

    Aluno.update({ _id: idAluno }, {$push:{notas: idNota}}, function(){
        res.redirect('/aluno/' + idAluno);
    });
});

//Trata get
router.get('/aluno/:_id/adicionarnota', function(req, res){
    res.render('nao-encontrado');
});


//Excluir nota
router.get('/aluno/:_id/excluirnota/:_idNota', function(req, res){

    let idAluno = req.params._id
    let idNota = req.params._idNota;

    Aluno.update({ _id: idAluno }, {$pull:{notas: idNota}}, function(){
        res.redirect('/aluno/' + idAluno);
    });
});


//Alterar nota
router.post('/aluno/:_id/editar', function(req, res){

    let idAluno = req.params._id;
    let nome = req.body.nome;
    let idProfessor = req.body.professor;

    //Selecionar aluno
    Aluno.findOne({"_id": idAluno}).then(function(results){
        let aluno = results;

        //seleciona e retira professor anterior
        Professor.update({ _id: aluno.professor._id}, {$pull:{alunos: idAluno}}, function(){

            //Seleciona novo professor e vincula aluno
            Professor.update({ _id: idProfessor}, {$push:{alunos: idAluno}}, function(){

                //Atualiza aluno
                Aluno.update({ _id: idAluno}, {nome: nome, professor: idProfessor}, function(){
                    res.redirect('/aluno/' + idAluno);
                });
            });
        });
    });
});

//Trata get
router.get('/aluno/:_id/editar', function(req, res){
    res.render('nao-encontrado');
});

//Exclui aluno
router.delete('/aluno/:_id/excluir', function(req, res){

    let id = req.params._id;

    Aluno.remove({ _id: id }, function(){
        res.redirect('/');
    })
});

//Trata get
router.get('/aluno/:_id/excluir', function(req, res){
    let id = req.params._id;

    Aluno.remove({ _id: id }, function(){
        res.redirect('/');
    })
});


//Listar professores
router.get('/professores', function(req, res){
    Professor.find({}).populate({path: 'professores', select: 'nome'}).then(function(results){
        res.render('professores', {professores: results});
    });
});


//Exibir professor
router.get('/professor/:_id', function(req, res){

    let id = req.params._id;

    var professorPopulateQuery = [
        {
            path:'alunos',
            model: 'Aluno'
        }
    ];

    Professor.find({"_id": id}).populate(professorPopulateQuery).then(function(results){
        res.render('professor', {professores:results});
    });
});


//Adiciona professor
router.post('/professores', function(req, res){

    let nome = req.body.nome;
    let materia = req.body.materia;

    let newProfessor = new Professor({nome: nome, materia: materia});

    newProfessor.save()
        .then(function(){
            res.redirect('/professores');
        }).catch(function(err){
            console.log(err);
            res.redirect('/professores');
        });
});


//Altera professor
router.post('/professor/:_id/editar', function(req, res){

    let id = req.params._id;
    let nome = req.body.nome;
    let materia = req.body.materia;

    Professor.update({ _id: id}, {nome: nome, materia: materia}, function(){
        res.redirect('/professor/' + id);
    });
});

//Trata get
router.get('/professor/:_id/editar', function(req, res){
    res.render('nao-encontrado');
});

//Exclui professor
router.delete('/professor/:_id/excluir', function(req, res){

    let id = req.params._id;

    Professor.remove({ _id: id }, function(){
        res.redirect('/professores');
    })
});

//Trata get
router.get('/professor/:_id/excluir', function(req, res){
    //res.render('nao-encontrado');
    let id = req.params._id;

    Professor.remove({ _id: id }, function(){
        res.redirect('/professores');
    })    
});


//Listar notas
router.get('/notas', function(req, res){
    Nota.find({}).then(function(results){
        res.render('notas', {notas: results});
    });
});

//Adiciona nota
router.post('/notas', function(req, res){

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    let newNota = new Nota({titulo: titulo, descricao: descricao});

    newNota.save()
        .then(function(){
            res.redirect('/notas');
        }).catch(function(err){
            console.log(err);
            res.redirect('/notas');
        });
});

//Exclui nota
router.get('/notas/:_id/excluir', function(req, res){

    let id = req.params._id;

    Nota.remove({ _id: id }, function(){
        res.redirect('/notas');
    })
});


module.exports = router;
