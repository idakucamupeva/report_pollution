require('dotenv').config();

const classServer = require('./src/classes/server')
const Server = new classServer();
const server = Server.getServer();

const Socket = require('./src/classes/socket')
const socket = new Socket(server)
