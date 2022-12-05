var express = require('express');
var router = express.Router();
var cotacaoModel = require('../model/cotacoes');
var controller = require('../controller/cotacoesController');
var usersModel = require('../model/Login');
var EmailModel = require('../model/SendEmail');
var Log = require('../controller/Log');

/* GET listing. */
router.get('/', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 401,
            route: 'cotacoes',
            method: 'get',
            user: user
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
  var cotacoes = await cotacaoModel.getCotacoes();
    Log.createLogFile({
        message: cotacoes,
        status: 401,
        route: 'cotacoes',
        method: 'get',
        user: user
    });
    res.send({status: 200, message: 'success', cotacoes:cotacoes});
});

/* nova cotacao. */
router.post('/', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
  var dist_rodovia_pav = req.body.dist_rodovia_pav;
    var dist_rodovia_nao_pav = req.body.dist_rodovia_nao_pav;
    var veiculo_id = req.body.veiculo_id;
    var carga = req.body.carga;
    var cliente_id = req.body.cliente_id;
    var cliente = await usersModel.getUserById(cliente_id);
    var custo  = await controller.calculaCusto(veiculo_id, dist_rodovia_pav, dist_rodovia_nao_pav, carga);
    var cotacao = await cotacaoModel.createCotacao(veiculo_id,dist_rodovia_pav, dist_rodovia_nao_pav, carga, custo,cliente);
    if(cotacao){
        cotacao = await cotacaoModel.getCotacoes();
        cotacao = cotacao[cotacao.length-1];
        EmailModel.sendEmail(cliente.email, 'Cotação', 'Sua cotação foi criada com sucesso. Código: '+cotacao.id+' Custo: '+cotacao.custo);
        Log.createLogFile({
            message: cotacao,
            status: 401,
            route: 'cotacoes',
            method: 'post',
            user: user
        });
        res.send({status: 200, message: 'success', cotacao:{
            id: cotacao.id,
            dist_rodovia_pav: cotacao.dist_rodovia_pav,
            dist_rodovia_nao_pav: cotacao.dist_rodovia_nao_pav,
            veiculo_id: cotacao.veiculo_id,
            carga: cotacao.carga,
            custo: cotacao.custo
            }});
    }else{
        Log.createLogFile({
            message: 'error',
            status: 401,
            route: 'cotacoes',
            method: 'post',
            user: user
        });
        res.send({status: 400, message: 'error'});
    }
});
/* atualiza cotacao. */
router.put('/:id', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 401,
            route: 'cotacoes',
            method: 'post',
            user: user
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
  var id = req.params.id;
    var [cotacao] = await cotacaoModel.getCotacoesById(id);
    if(cotacao){
        cotacao.dist_rodovia_pav = req.body.dist_rodovia_pav??cotacao.dist_rodovia_pav;
        cotacao.dist_rodovia_nao_pav = req.body.dist_rodovia_nao_pav??cotacao.dist_rodovia_nao_pav;
        cotacao.veiculo_id = req.body.veiculo_id??cotacao.veiculo_id;
        cotacao.carga = req.body.carga??cotacao.carga;
        //update cotacao
        var custo = await controller.calculaCusto(cotacao.veiculo_id, cotacao.dist_rodovia_pav, cotacao.dist_rodovia_nao_pav, cotacao.carga);
        cotacao.custo = custo;
        var cliente_id = cotacao.cliente;
        var cliente = await usersModel.getUserById(cliente_id);
        var r = await cotacaoModel.updateCotacao(cotacao);
        if(r){
            Log.createLogFile({
                message: cotacao,
                status: 401,
                route: 'cotacoes',
                method: 'post',
            });
            EmailModel.sendEmail(cliente.email, 'Cotação', 'Sua cotação foi atualizada com sucesso. Código: '+cotacao.id+' Custo: '+cotacao.custo);
            res.send({status: 200, message: 'success', cotacao:cotacao});
        }else{
            Log.createLogFile({
                message: cotacao,
                status: 401,
                route: 'cotacoes',
                method: 'post',
            });
            res.send({status: 400, message: 'error'});
        }
    }else {
        Log.createLogFile({
            message: 'error',
            status: 401,
            route: 'cotacoes',
            method: 'post',
        });
        res.send({status: 401, message: 'error'});
    }

});

/* delete cotacao. */
router.delete('/:id', async function(req, res, next) {
    var token = req.headers.authorization;
    var [user] = await usersModel.getUserByToken(token);
    if(!user){
        Log.createLogFile({
            message: 'error token vencido',
            status: 401,
            route: 'cotacoes',
            method: 'delete',
        });
        res.send({status: 401, message: 'error token vencido'});
        return;
    }
    var id = req.params.id;
        var cotacao = await cotacaoModel.deleteCotacao(id);
        if(cotacao){
            Log.createLogFile({
                message: cotacao,
                status: 200,
                route: 'cotacoes',
                method: 'delete',
            });
            res.send({status: 200, message: 'success'});
        }else {
            Log.createLogFile({
                message: 'error',
                status: 200,
                route: 'cotacoes',
                method: 'delete',
            });
            res.send({status: 400, message: 'error'});
        }
});

module.exports = router;
