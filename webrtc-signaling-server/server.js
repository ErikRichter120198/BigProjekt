const express = require("express");
const https = require("https");
const fs = require("fs");
const socketIo = require("socket.io");
const path = require("path");

const app = express();

// Lade dein SSL-Zertifikat und den privaten Schlüssel
const sslOptions = {
  key: fs.readFileSync("/etc/ssl/certs/cert.pem"),
  cert: fs.readFileSync("/etc/ssl/private/key.pem"),
};

// Erstelle einen HTTPS-Server
const server = https.createServer(sslOptions, app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Leite alle HTTP-Anfragen auf HTTPS um
app.use((req, res, next) => {
  if (!req.secure) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Stelle statische Dateien bereit, falls nötig
app.use(express.static(path.join(__dirname, 'public')));

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
