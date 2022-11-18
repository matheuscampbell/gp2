var db = require('./DbConn');

module.exports = class  {
    static async getCotacoes() {
        return await db.query('SELECT * FROM cotacoes');
    }

    static async getCotacoesById(id) {
        return await db.query('SELECT * FROM cotacoes WHERE id = ?', [id]);
    }

    static async createCotacao(veiculo_id, dist_rod_pav, dist_rod_n_pav, carga, custo) {
        return await db.query('INSERT INTO cotacoes (veiculo_id, dist_rod_pav, dist_rod_n_pav, carga, custo, created_at) VALUES (?, ?, ?, ?, ?, ?)', [veiculo_id, dist_rod_pav, dist_rod_n_pav, carga, custo, Date.now()]);
    }

    static async updateCotacao(id, veiculo_id, dist_rodovia_pav, dist_rodovia_nao_pav, carga, custo) {
        return await db.query('UPDATE cotacoes SET veiculo_id = ?, dist_rod_pav = ?, dist_rod_n_pav = ?, carga = ?, custo = ?, updated_at = ? WHERE id = ?', [veiculo_id, dist_rodovia_pav, dist_rodovia_pav, carga, custo, Date.now(), id]);
    }

    static async deleteCotacao(id) {
        return await db.query('DELETE FROM cotacoes WHERE id = ?', [id]);
    }





}