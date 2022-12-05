var express = require('express');
var router = express.Router();
var dbConf = require('../model/DbConn');
var loginModel = require('../model/Login');
var emailModel = require('../model/SendEmail');
const Log = require("../controller/Log");

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConf.makeTables();
  res.render('index', { title: 'Express' });
});

router.post('/getToken',  function(req, res, next) {
  var email = req.body.email;
  var password = req.body.senha;
    loginModel.login(email, password).then((r)=>{
        if(r.length > 0){
            var token = loginModel.updateToken(r[0].id);
            emailModel.sendEmail(email,"login Realizado ","Login realizado as : "+Date.now());
            Log.createLogFile({
                message: 'login realizado',
                status: 200,
                route: 'getToken',
                method: 'post',
                user: r[0]
            });
            res.send({status: 200, message: 'success', token:token});
        }else{
            Log.createLogFile({
                message: 'requisição inválida',
                status: 200,
                route: 'getToken',
                method: 'post',
            });
            res.send({status: 400, message: 'error'});
        }
    });
});

router.post('/createUser', async function(req, res, next) {
    var nome = req.body.nome;
    var email = req.body.email;
    var password = req.body.senha;
    loginModel.createUser(nome, email, password).then((r)=>{
        if(r){
            Log.createLogFile({
                message: 'usuario criado',
                status: 200,
                route: 'createUser',
                method: 'post',
            });
            emailModel.sendEmail(email, 'Bem vindo', 'Bem vindo ao sistema de fretes');
            res.send({status: 200, message: 'success'});
        }else{
            Log.createLogFile({
                message: 'error',
                status: 400,
                route: 'createUser',
                method: 'post',
            });
            res.send({status: 400, message: 'error'});
        }
    });
});

router.post('/createClient', function(req, res, next) {
    var nome = req.body.nome;
    var email = req.body.email;
    var password = req.body.senha;
    loginModel.createClient(nome, email, password).then((r)=>{
        if(r){
            Log.createLogFile({
                message: 'cliente criado',
                status: 400,
                route: 'createClient',
                method: 'post',
            });
            emailModel.sendEmail(email, 'Bem vindo', 'Bem vindo ao sistema de fretes');
            res.send({status: 200, message: 'success'});
        }else{
            Log.createLogFile({
                message: 'error',
                status: 400,
                route: 'createClient',
                method: 'post',
            });
            res.send({status: 400, message: 'error'});
        }
    });
});



module.exports = router;
