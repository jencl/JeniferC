const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de docentes
router.get("/", (req, res) => {
    const docentes = req.app.db.get("docentes");
    res.send(docentes);
});

// Obtener un docente por ID
router.get("/:id", (req, res) => {
    const docente = req.app.db.get("docentes").find({ id: req.params.id }).value();
    
    if (!docente) {
        return res.sendStatus(404);
    }

    res.send(docente);
});

// Crear un nuevo docente
router.post("/", (req, res) => {
    try {
        const docente = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("docentes").push(docente).write();
        
        res.status(201).send(docente);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un docente
router.put("/:id", (req, res) => {
    try {
        const updatedDocente = req.app.db
            .get("docentes")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        if (!updatedDocente) {
            return res.sendStatus(404);
        }

        res.send(req.app.db.get("docentes").find({ id: req.params.id }).value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un docente por ID
router.delete("/:id", (req, res) => {
    const result = req.app.db
        .get("docentes")
        .remove({ id: req.params.id })
        .write();

    if (result.length === 0) {
        return res.sendStatus(404);
    }

    res.sendStatus(204);
});

module.exports = router;