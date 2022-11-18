const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./model/db/database.db');

module.exports = class {
    static async query(sql, params) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    //meke database tables
    static async makeTables() {
        //create table veiculos (id, nome, fator, created_at)
        db.run('CREATE TABLE IF NOT EXISTS veiculos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, fator REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
        // create table cotacoes (id, veiculo_id, dist_rod_pav, dist_rod_n_pav, carga, custo, created_at, updated_at)
        db.run('CREATE TABLE IF NOT EXISTS cotacoes (id INTEGER PRIMARY KEY AUTOINCREMENT, veiculo_id INTEGER, dist_rod_pav REAL, dist_rod_n_pav REAL, carga REAL, custo REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)');

    }

};