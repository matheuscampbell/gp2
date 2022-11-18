var db = require('./DbConn');

module.exports = class  {
    static async getVeiculos() {
        return await db.query('SELECT * FROM veiculos');
    }

    static async getVeiculosById(id) {
        return await db.query('SELECT * FROM veiculos WHERE id = ?', [id]);
    }

    static async createVeiculo(nome, fator) {
        return await db.query('INSERT INTO veiculos (nome, fator, create_at) VALUES (?, ?, ?, ?)', [nome, fator, Date.now()]);
    }

    static async updateVeiculo(id, nome, fator) {
        return await db.query('UPDATE veiculos SET nome = ?, fator = ?, update_at = ? WHERE id = ?', [nome,fator, Date.now(), id]);
    }

    static async deleteVeiculo(id) {
        return await db.query('DELETE FROM veiculos WHERE id = ?', [id]);
    }



}