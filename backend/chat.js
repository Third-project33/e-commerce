const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../next/src/pages/chat.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});