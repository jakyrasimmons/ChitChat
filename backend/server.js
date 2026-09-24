








// Jakyra's Work Below ************************************************************************************************************************\

const express = require("express"); //get rid of (use jesus's)

//import socket.io and http(http built into node)
const { Server } = require("socket.io"); //keep when integrating
const http = require("http"); //keep when integrating

const app = express(); //get rid of (use jesus's)
//creating http server and socket.io server
const server = http.createServer(app); //using app here is where the connection happens
const io = new Server(server);

//jesus api (app.get(...))

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

//get rid of this test(use jesus's should say app.listen but we change to server.listen) 
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
