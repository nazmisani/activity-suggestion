if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 8080;

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const AuthController = require("./controllers/authController");
const ProfileController = require("./controllers/profileController");
const ActivityController = require("./controllers/activityController");
const authentication = require("./middlewares/authentication");
const authorization = require("./middlewares/authorization");
const errorHandler = require("./middlewares/errorHandler");
const upload = require("./utils/multer");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.emit("welcome", "Hello Mr/Mrs " + socket.id);

  if (socket.handshake.auth) {
    console.log("username : " + socket.handshake.auth.username);
    console.log(socket.handshake);
  }

  socket.on("message:new", (message) => {
    io.emit("message:update", {
      from: socket.handshake.auth.username,
      message,
    });
  });
});

app.post("/register", AuthController.register);
app.post("/login", AuthController.login);
app.post("/google-login", AuthController.googleLogin);

app.use(authentication);

app.get("/profile", authorization, ProfileController.read);
app.post("/profile", upload.single("file"), authorization, ProfileController.post);
app.put("/profile", upload.single("file"), authorization, ProfileController.update);
// app.patch("/profile", upload.single("file"), authorization, ProfileController.patch);

app.get("/activity", authorization, ActivityController.read);
app.post("/activity", authorization, ActivityController.create);
app.get("/generate-activity", authorization, ActivityController.generate);
app.delete("/activity/:id", authorization, ActivityController.delete);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
    console.log(`server listening to port : ${PORT}`);
  });
}

module.exports = app;
