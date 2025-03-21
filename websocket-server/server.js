const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(cors());

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-stream", (streamId) => {
        socket.join(streamId);
        console.log(`${socket.id} joined stream: ${streamId}`);
    });

    socket.on("offer", (data) => {
        socket.to(data.streamId).emit("offer", data);
    });

    socket.on("answer", (data) => {
        socket.to(data.streamId).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
        socket.to(data.streamId).emit("ice-candidate", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("WebSocket server running on port 3000");
});
