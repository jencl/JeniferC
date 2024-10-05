const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de cursos
router.get("/", (req, res) => {
    const cursos = req.app.db.get("cursos");

    res.send(cursos);
});

// Obtener un curso desde la ID
router.get("/:id", (req, res) => {
    const curso = req.app.db.get("cursos").find({ id: req.params.id }).value();
    
    if (!curso) {
        res.sendStatus(404);
    }

    res.send(curso);
});

// Crear un nuevo curso
router.post("/", (req, res) => {
    try {
        const curso = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("cursos").push(curso).write();
        
        res.send(curso);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un curso
router.put("/:id", (req, res) => {
    try {
        req.app.db
        .get("cursos")
        .find({ id: req.params.id })
        .assign(req.body)
        .write();

        res.send(req.app.db.get("cursos").find({ id: req.params.id }));
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un curso con su ID
router.delete("/:id", (req, res) => {
    try {
        req.app.db
        .get("cursos")
        .remove({ id: req.params.id })
        .write();

        res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;