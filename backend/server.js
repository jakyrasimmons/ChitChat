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

//db attempt 
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync('database.db');
db.exec('PRAGMA journal_mode = WAL;');
db.exec(`
  CREATE TABLE IF NOT EXISTS usernames (
    birthid INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL
  )`);

const query = db.prepare('SELECT username FROM usernames WHERE birthid = ?');
const store = db.prepare('INSERT INTO usernames (birthid, username) VALUES (?, ?)');

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

    const name = query.get(Number(socket.data.birth));
    if (name) {
      socket.emit('returning_user', name);
    }

    socket.on('name_to_try', (screen_name) => {
      try {
        const result = store.run(socket.data.birth, screen_name);
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          socket.emit('name_try_again');
        }
      }
    });

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
