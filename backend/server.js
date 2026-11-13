const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

//import socket.io and http(http built into node)
const { Server } = require("socket.io"); //keep when integrating
const http = require("http"); //keep when integrating

//creating http server and socket.io server
const server = http.createServer(app); //using app here is where the connection happens
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.get('/', (req, res) => {
});

//Occurs on server connection attempt.
io.use((socket, next) => {
  const rawCookies = socket.handshake.headers.cookie;
  console.log(rawCookies);
  if (rawCookies) {
    socket.data.birth = rawCookies.split("=", 2)[1]; 
    console.log(socket.data.birth);
  }
  next();
});

//Occurs after successful server connection is established. 
io.on("connection", (socket) => {
    console.log("A socket connected: " + socket.id);

    //when a message is sent (users socket)
    socket.on("message", (message) => {
        console.log("Message received:", message);

        //send the message to clients
        socket.broadcast.emit("message", message);
    });
    
    //if someone leaves chat 
    socket.on("disconnect", () => {
        console.log("A socket disconnected: " + socket.id);
    });
});

server.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
