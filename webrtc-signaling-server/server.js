const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const frontendip ="https://www.konferenz1.de"

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
const PORT = process.env.PORT || 3000;
io.on("connection", (socket) => {
  console.log("Neuer Client verbunden:", socket.id);
  socket.on("join", (room) => {
    socket.join(room);
    socket.to(room).emit("user-connected");
  });
  socket.on("offer", (offer, room) => {
    socket.to(room).emit("offer", offer);
  });
  socket.on("answer", (answer, room) => {
    socket.to(room).emit("answer", answer);
  });
  socket.on("candidate", (candidate, room) => {
    socket.to(room).emit("candidate", candidate);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server lauscht auf Port ${PORT}`);
});