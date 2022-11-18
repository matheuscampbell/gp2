var express = require('express');
var router = express.Router();
var cotacaoModel = require('../model/cotacoes');
var controller = require('../controller/cotacoesController');

/* GET listing. */
router.get('/', async function(req, res, next) {
  var cotacoes = await cotacaoModel.getCotacoes();
    res.send({status: 200, message: 'success', cotacoes:cotacoes});
});

/* nova cotacao. */
router.post('/', async function(req, res, next) {
  var dist_rodovia_pav = req.body.dist_rodovia_pav;
    var dist_rodovia_nao_pav = req.body.dist_rodovia_nao_pav;
    var veiculo_id = req.body.veiculo_id;
    var carga = req.body.carga;
    var custo  = await controller.calculaCusto(veiculo_id, dist_rodovia_pav, dist_rodovia_nao_pav, carga);
    var cotacao = await cotacaoModel.createCotacao(veiculo_id,dist_rodovia_pav, dist_rodovia_nao_pav, carga, custo);
    if(cotacao){
        cotacao = await cotacaoModel.getCotacoes();
        cotacao = cotacao[cotacao.length-1];
        res.send({status: 200, message: 'success', cotacao:{
            id: cotacao.id,
            dist_rodovia_pav: cotacao.dist_rodovia_pav,
            dist_rodovia_nao_pav: cotacao.dist_rodovia_nao_pav,
            veiculo_id: cotacao.veiculo_id,
            carga: cotacao.carga,
            custo: cotacao.custo
            }});
    }else{
        res.send({status: 400, message: 'error'});
    }
});
/* atualiza cotacao. */
router.put('/:id', async function(req, res, next) {
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
        var r = await cotacaoModel.updateCotacao(cotacao);
        if(r){
            res.send({status: 200, message: 'success', cotacao:cotacao});
        }else{
            res.send({status: 400, message: 'error'});
        }
    }else {
        res.send({status: 401, message: 'error'});
    }

});

/* delete cotacao. */
router.delete('/:id', async function(req, res, next) {
    var id = req.params.id;
        var cotacao = await cotacaoModel.deleteCotacao(id);
        if(cotacao){
            res.send({status: 200, message: 'success'});
        }else {
            res.send({status: 400, message: 'error'});
        }
});

module.exports = router;
