// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Verwaltung der verbundenen Clients
const clients = new Map();

io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);

  // Client tritt einem Raum bei
  socket.on("join", () => {
    const rooms = Array.from(io.sockets.adapter.rooms.keys()).filter(
      (room) => room !== socket.id
    );
    const room = rooms.find(
      (room) => io.sockets.adapter.rooms.get(room).size === 1
    );
    if (room) {
      socket.join(room);
      socket.to(room).emit("offer", socket.id, socket.id);
    } else {
      socket.join(socket.id);
    }
  });

  // Client sendet ein Angebot an einen anderen Client
  socket.on("offer", (id, description) => {
    socket.to(id).emit("offer", socket.id, description);
  });

  // Client sendet eine Antwort auf ein Angebot eines anderen Clients
  socket.on("answer", (id, description) => {
    socket.to(id).emit("answer", description);
  });

  // Client sendet eine ICE-Kandidateninformation an andere Clients
  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });

  // Client sendet seinen Kamera-Status (an/aus)
  socket.on("toggleCamera", (isCameraOn) => {
    clients.set(socket.id, { ...clients.get(socket.id), isCameraOn });
    socket.broadcast.emit("cameraStatusChanged", socket.id, isCameraOn);
  });

  // Client wird getrennt
  socket.on("disconnect", () => {
    clients.delete(socket.id);
    console.log("Client getrennt:", socket.id);
  });

  // Initialisierung des Clients mit Kamera-Status (Standard: an)
  clients.set(socket.id, { isCameraOn: true });
});

server.listen(PORT, () => {
  console.log(`Server lauscht auf Port ${PORT}`);
});
