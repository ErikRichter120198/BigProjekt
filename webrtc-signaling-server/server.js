const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const frontendip = "https://www.konferenz1.de";

// CORS-Konfiguration
app.use(cors({
  origin: frontendip,
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: frontendip,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 442;

// Socket.IO Verbindungen behandeln
io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} ist dem Raum ${room} beigetreten.`);
    socket.to(room).emit("user-connected", socket.id);
  });

  socket.on("offer", (offer, room) => {
    console.log(`Client ${socket.id} hat ein Angebot gesendet:`, offer);
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", (answer, room) => {
    console.log(`Client ${socket.id} hat eine Antwort gesendet:`, answer);
    socket.to(room).emit("answer", answer);
  });

  socket.on("candidate", (candidate, room) => {
    console.log(`Client ${socket.id} hat einen Kandidaten gesendet:`, candidate);
    socket.to(room).emit("candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Wenn du möchtest, kannst du hier auch eine Nachricht an den Raum senden, dass der Benutzer getrennt ist.
  });

  // Fehlerbehandlung für Socket.IO
  socket.on("error", (error) => {
    console.error("Socket.IO-Fehler:", error);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server lauscht auf Port ${PORT}`);
});
