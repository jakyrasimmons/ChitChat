const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

//####
//const cookieParser = require('cookie-parser')
//app.use(cookieParser());
//####

//import socket.io and http(http built into node)
const { Server } = require("socket.io"); //keep when integrating
const http = require("http"); //keep when integrating

//creating http server and socket.io server
const server = http.createServer(app); //using app here is where the connection happens
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

//when someone connects to server

//####
//io.get("/private", (req, res) => {
//	if (!req.cookies.token) return res.status(401).send();
//	res.status(200).json({ secret: "Abe bday"});
//});
//####

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    //when a message is sent (users socket)
    socket.on("message", (message) => {
        console.log("Message received:", message);

        //send the message to clients
        socket.broadcast.emit("message", message);
    });
    
    //if someone leaves chat 
    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
