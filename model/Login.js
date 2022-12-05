var db = require('./DbConn');
const {token} = require("morgan");
var crypto = require('crypto');
module.exports = class  {
    static async login(email, password) {
        return await db.query('SELECT * FROM usuarios WHERE email = ? AND pass = ?', [email, password]);
    }

    static async getUserByToken(token){
        return await db.query('SELECT * FROM usuarios WHERE token = ? AND tokenvalidade > ?', [token, Date.now()]);
    }

    static async createUser(nome, email, password) {
        return await db.query('INSERT INTO usuarios (nome, email, pass, tipo, created_at, token) VALUES (?, ?, ?,1, ?, ?)', [nome, email, password, Date.now(), this.newToken()]);
    }

    static async createClient(nome,email,pass){
        return await db.query('INSERT INTO usuarios (nome, email, pass, tipo, created_at, token) VALUES (?, ?, ?,2, ?,?)', [nome, email, pass, Date.now(), this.newToken()]);
    }

    static async updateToken(iduser){
        var token = this.newToken();
        await db.query('UPDATE usuarios SET token = ?, tokenvalidade = ? WHERE id = ?', [token, Date.now()+1000*60*60*2, iduser]);
        return token;
    }

    static async getUserById(id){
        var r = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return r[0];
    }

    //token
    static newToken(){
        return crypto.randomBytes(20).toString('hex');
    }

};