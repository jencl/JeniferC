const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de lecciones
router.get("/", (req, res) => {
    const lecciones = req.app.db.get("lecciones").value();
    res.send(lecciones);
});

// Obtener una lección por su ID
router.get("/:id", (req, res) => {
    const leccion = req.app.db.get("lecciones").find({ id: req.params.id }).value();
    
    if (!leccion) {
        return res.sendStatus(404);
    }

    res.send(leccion);
});

// Crear una nueva lección
router.post("/", (req, res) => {
    try {
        const leccion = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("lecciones").push(leccion).write();
        
        res.status(201).send(leccion); // Cambiado a 201 para indicar que se creó un recurso
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar una lección
router.put("/:id", (req, res) => {
    try {
        const leccion = req.app.db.get("lecciones").find({ id: req.params.id });

        if (!leccion.value()) {
            return res.sendStatus(404);
        }

        leccion.assign(req.body).write();

        res.send(leccion.value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar una lección por su ID
router.delete("/:id", (req, res) => {
    const leccion = req.app.db.get("lecciones").find({ id: req.params.id });

    if (!leccion.value()) {
        return res.sendStatus(404);
    }

    req.app.db.get("lecciones").remove({ id: req.params.id }).write();
    res.sendStatus(200);
});

module.exports = router;
