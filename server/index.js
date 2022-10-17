//express boiler plate
const express = require("express");
const app = express();
//hardcodes port to 4000
const PORT = 4000;

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//imports http and cors library aloowing data transfer between client and server
const http = require("http").Server(app);
const cors = require("cors");

//imports Socket.io to create real-time connection
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//connects to react app, creates unique ID for each socket
socketIO.on('connection', (socket) => {
    //logs ID whenever user visits the page
    console.log(`⚡: ${socket.id} user just connected!`);
    //disconnects socket on refreshe or close of website
    socket.on('disconnect', () => {
            socket.disconnect()
    // logs disconnection
      console.log('🔥: A user disconnected');
    });
});


//returns json object when visiting app
app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

//console logs which port is being accessed
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});