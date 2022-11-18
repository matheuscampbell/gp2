var veiculosModel = require('../model/Veiculos');
module.exports = class  {

    static async calculaCusto(veiculo_id, dist_rod_pav, dist_rod_n_pav, carga) {
        var custo_rodovia_pav = 0.63,
        custo_rodovia_n_pav = 0.72,
        adicional_acima_5t = 0.3;
        var [veiculo] = await veiculosModel.getVeiculosById(veiculo_id);
        var custo = (veiculo.fator * ((dist_rod_pav*custo_rodovia_pav) + (dist_rod_n_pav*custo_rodovia_n_pav)));
        if(carga > 5000){
            custo += (dist_rod_pav+dist_rod_n_pav) * adicional_acima_5t;
        }
        return custo;
    }
}