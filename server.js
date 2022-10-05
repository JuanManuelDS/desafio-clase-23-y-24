import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import { homeRouter, productRouter, loginRouter } from "./routes/index.js";
import { socketController } from "./src/utils/socketController.js";
import MongoStore from "connect-mongo";

//Creacion de Servidor y Sockets
const app = express();
const PORT = process.env.port || 8080;
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
socketController(io);
//Inicio de Servidor
httpServer.listen(process.env.PORT || PORT, () =>
  console.log("Servidor Funcionando en Puerto: " + PORT)
);
httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));

//Configuro Servidor
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion de Session
// app.use(
//   session({
//     secret: "secreto",
//     cookie: { maxAge: 600000 },
//     //resave viene de la documentacion
//     resave: true,
//     saveUninitialized: true,
//   })
// );

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://franchas123:fran123@cluster0.zqkvn9v.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "secreto",
    cookie: { maxAge: 600000 },
    //resave viene de la documentacion
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  req.session.touch();
  next();
});

app.get("/", (req, res) => {
  res.send("Bienvenido al Ejercicio");
});

app.use("/api/products-test", productRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);

app.get("/logout", (req, res) => {
  let username = req.session.username;

  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    }
    res.render("pages/logout", { name: username });
  });
});

//ruta de servidor Api Rest

// app.all("*", (req, res) => {
//   res.status(404).send("Ruta no encontrada");
// });
