const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de artículos
router.get("/", (req, res) => {
    const articulos = req.app.db.get("articulos");

    res.send(articulos);
});

// Obtener un artículo desde la ID
router.get("/:id", (req, res) => {
    const articulo = req.app.db.get("articulos").find({ id: req.params.id }).value();
    
    if (!articulo) {
        res.sendStatus(404);
    }

    res.send(articulo);
});

// Crear un nuevo artículo
router.post("/", (req, res) => {
    try {
        const articulo = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("articulos").push(articulo).write();
        
        res.send(articulo);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un artículo
router.put("/:id", (req, res) => {
    try {
        req.app.db
        .get("articulos")
        .find({ id: req.params.id })
        .assign(req.body)
        .write();

        res.send(req.app.db.get("articulos").find({ id: req.params.id}));
    } catch (error) {
        return res.status(500).send(error);
    }
});
//Elimina un articulo con su ID
router.delete("/:id", (req, res ) => {
    req.accepted.db
    .get("articulos")
    .remove({id: req.params.id })
    .write();

    res.sendStatus(200);
});

module.exports = router;
