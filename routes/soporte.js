const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de tickets de soporte
router.get("/", (req, res) => {
    const soporte = req.app.db.get("soporte");
    res.send(soporte);
});

// Obtener un ticket de soporte por su ID
router.get("/:id", (req, res) => {
    const ticket = req.app.db.get("soporte").find({ id: req.params.id }).value();
    
    if (!ticket) {
        return res.sendStatus(404);
    }

    res.send(ticket);
});

// Crear un nuevo ticket de soporte
router.post("/", (req, res) => {
    try {
        const ticket = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("soporte").push(ticket).write();
        
        res.status(201).send(ticket); // Estado 201 para creación
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un ticket de soporte
router.put("/:id", (req, res) => {
    try {
        const ticket = req.app.db.get("soporte").find({ id: req.params.id });

        if (!ticket.value()) {
            return res.sendStatus(404);
        }

        ticket.assign(req.body).write();
        res.send(ticket.value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un ticket de soporte por su ID
router.delete("/:id", (req, res) => {
    req.app.db.get("soporte").remove({ id: req.params.id }).write();
    res.sendStatus(200);
});

module.exports = router;                                                                                                  