const app = require('./config/express');
const config = require('./config/config');
const { Socket } = require('socket.io');
const http = require('http').createServer();

const io=require('socket.io') (http, {
    cors:{origin:"*"}
});


// initialize mongo
require('./config/mongoose');

// listen to the port 
app.listen(config.port, () => {
    console.log(`listening on port ${config.port} (${config.env})`); 
});

