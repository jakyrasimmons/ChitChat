








// Jakyra's Work Below ************************************************************************************************************************\

const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (message) => {
        console.log("Message received:", message);

        io.emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
