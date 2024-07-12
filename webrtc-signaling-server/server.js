// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);

  // Client tritt einem Raum bei
  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("user-connected", socket.id);

    // Behandle 'disconnect'
    socket.on("disconnect", () => {
      socket.to(room).emit("user-disconnected", socket.id);
    });

    // Behandle Signalisierungsnachrichten
    socket.on("offer", (offer, callback) => {
      socket.to(room).emit("offer", socket.id, offer);
      callback();
    });

    socket.on("answer", (answer, callback) => {
      socket.to(room).emit("answer", socket.id, answer);
      callback();
    });

    socket.on("candidate", (candidate, callback) => {
      socket.to(room).emit("candidate", socket.id, candidate);
      callback();
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server lauscht auf Port ${PORT}`);
});

