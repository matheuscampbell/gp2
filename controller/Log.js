var fs = require('fs');
module.exports = class  {
    static async createLogFile(log) {
        log = JSON.stringify(log);
        var path = require('path');
        var logPath = path.join(__dirname, '../ftpserver/ftp/');
        var logFile = path.join(logPath, Date.now() + '.txt');
        fs.writeFileSync(logFile, log);
        return true;
    }
}