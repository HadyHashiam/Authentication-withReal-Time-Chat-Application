require('dotenv').config();

const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./Controllers/database.Controller');
const morgan = require("morgan");                   // the logger


const userRoute = require("./routes/user.Route")
const authRoute = require("./routes/auth.Route")
const friendRequestRoutes = require('./Routes/friendRequest.Route');
const chatRoute = require('./Routes/chat.Route');
const messageRoutes = require('./Routes/message.Route');
// create express app
const app = express();
const server = http.createServer(app);
const io = socketio(server);
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`)
}


app.use("/test", (req, res) => {
  console.log("hey in url test ");
})



app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/friends', friendRequestRoutes);
app.use('/api/chats', (req, res, next) => {
  req.io = io; // إضافة io إلى req
  next();
}, chatRoute);
app.use('/api/messages', (req, res, next) => {
  req.io = io; // إضافة io إلى req
  next();
}, messageRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
  });
  socket.on('sendMessage', ({ chatId, message }) => {
    io.to(chatId).emit('message', message);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});


