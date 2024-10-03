const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de notificaciones
router.get("/", (req, res) => {
    const notificaciones = req.app.db.get("notificaciones");

    res.send(notificaciones);
});

// Obtener una notificación desde la ID
router.get("/:id", (req, res) => {
    const notificacion = req.app.db.get("notificaciones").find({ id: req.params.id }).value();
    
    if (!notificacion) {
        return res.sendStatus(404);
    }

    res.send(notificacion);
});

// Crear una nueva notificación
router.post("/", (req, res) => {
    try {
        const notificacion = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("notificaciones").push(notificacion).write();
        
        res.send(notificacion);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar una notificación
router.put("/:id", (req, res) => {
    try {
        const notificacion = req.app.db
            .get("notificaciones")
            .find({ id: req.params.id });

        if (!notificacion.value()) {
            return res.sendStatus(404);
        }

        notificacion.assign(req.body).write();

        res.send(notificacion.value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar una notificación con su ID
router.delete("/:id", (req, res) => {
    req.app.db
        .get("notificaciones")
        .remove({ id: req.params.id })
        .write();

    res.sendStatus(200);
});

module.exports = router;