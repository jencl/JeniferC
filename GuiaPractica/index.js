//Importar todas las librerias necesarias.
const express = require("express");
const cors =require("cors");
const morgan =require("morgan");
const low =require("lowdb");
const articulosRouter = require("./routes/articulos")

//Determinamos el puerto del EndPoint
const PORT = process.env. PORT || 10801;

//Obtenemos la libreria controlador del Archivo

const FileSync = require("lowdb/adapters/FileSync");

//Creamos el archivo db.json
const adapter = new FileSync("db.json");
const db= low(adapter);

//inicializamos la BD

db.defaults({articulos: [] }).write();

const app = express(); //Creamos el aplicativo 

app.db =db; //Definimos el DBÑ

//Definimos las variables necesarias.
app.use(cors());
app.use(express.json ());
app.use(morgan("dev"));

//Mostramos el log de ejecución del servidor
app.listen(PORT, ()=> console.log( `El servidor esta corriendo en el puerto ${PORT}`));

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Librerias APIs - CERTUS" ,
            version: "1.0.0",
            description: "Demo de Librerias de Ventas API",
        },
        servers: [
            {
                url: "http://localhost:" + PORT
            },
        ],
    },
    apis: ["./routes/*.js"]
};

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/articulos",articulosRouter)
