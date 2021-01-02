const http = require('http')
const app = require('../app')
const port = process.env.PORT || 3000;

class Server {
    constructor() {
        this.server = http.createServer(app);
        this.server.listen(port);
        this.server.once('listening', () => {
            console.log(`Listening on port: ${port}`);
        });
    }

    getServer() {
        return this.server;
    }
}

module.exports = Server;