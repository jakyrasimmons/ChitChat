const express = require('express');
const app = express();
const port = 8080;

//import socket.io and http(http built into node)
const { Server } = require("socket.io"); //keep when integrating
const http = require("http"); //keep when integrating

//creating http server and socket.io server
const server = http.createServer(app); //using app here is where the connection happens
const io = new Server(server);

app.get('/', (req, res) => {
	res.send('Hello Jakyra and Jesus!');
});

//when someone connects to server
io.on("connection", (socket) => {
    console.log("A user connected");

    //when a message is sent (users socket)
    socket.on("message", (message) => {
        console.log("Message received:", message);

        //send the message to clients
        io.emit("message", message);
    });
    
    //if someone leaves chat 
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
