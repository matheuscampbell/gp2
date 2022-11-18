var express = require('express');
var router = express.Router();
var veiculoModel = require('../model/Veiculos');

/* GET users listing. */
router.get('/', async function(req, res, next) {
    var veiculos = await veiculoModel.getVeiculos();
        res.send({status: 200, message: 'success', veiculos:veiculos});
});

/* GET users listing. */
router.get('/:id', async function(req, res, next) {
    var id = req.params.id;
    var [veiculos] = await veiculoModel.getVeiculosById(id);
        res.send({status: 200, message: 'success', veiculo:veiculos});
});

router.post('/:id', async function(req, res, next) {
  var id = req.params.id;
    var [veiculo] = await veiculoModel.getVeiculosById(id);
    if(veiculo){
        veiculo.fator = req.body.fatordemultiplicacao??veiculo.fatordemultiplicacao;
        //update veiculo
        var r = await veiculoModel.updateVeiculo(veiculo);
        if(r){
            res.send({status: 200, message: 'success', veiculo:veiculo});
        }else{
            res.send({status: 400, message: 'error'});
        }
    }
    res.send({status: 401, message: 'error'});
});

module.exports = router;
