var express = require('express');
var router = express.Router();
var veiculoModel = require('../model/Veiculos');
const usersModel = require("../model/Login");
const Log = require("../controller/Log");

/* GET users listing. */
router.get('/', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 400,
            route: 'veiculos',
            method: 'get',
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
    var veiculos = await veiculoModel.getVeiculos();
    Log.createLogFile({
        message: veiculos,
        status: 200,
        route: 'veiculos',
        method: 'get',
    });
    res.send({status: 200, message: 'success', veiculos:veiculos});
});

/* GET users listing. */
router.get('/:id', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 400,
            route: 'veiculos',
            method: 'get',
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
    var id = req.params.id;
    var [veiculos] = await veiculoModel.getVeiculosById(id);
    Log.createLogFile({
        message: veiculos,
        status: 200,
        route: 'veiculos',
        method: 'get',
    });
    res.send({status: 200, message: 'success', veiculo:veiculos});
});

router.post('/:id', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 401,
            route: 'veiculos',
            method: 'post',
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
  var id = req.params.id;
    var [veiculo] = await veiculoModel.getVeiculosById(id);
    if(veiculo){
        veiculo.fator = req.body.fatordemultiplicacao??veiculo.fatordemultiplicacao;
        //update veiculo
        var r = await veiculoModel.updateVeiculo(veiculo);
        if(r){
            Log.createLogFile({
                message: 'veiculo atualizado',
                status: 200,
                route: 'veiculos',
                method: 'post',
            });
            res.send({status: 200, message: 'success', veiculo:veiculo});
        }else{
            res.send({status: 400, message: 'error'});
        }
    }
    res.send({status: 401, message: 'error'});
    Log.createLogFile({
        message: 'error',
        status: 401,
        route: 'veiculos',
        method: 'post',
    });
});

module.exports = router;
