const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de progresos
router.get("/", (req, res) => {
    const progresos = req.app.db.get("progresos");

    res.send(progresos);
});

// Obtener un progreso desde la ID
router.get("/:id", (req, res) => {
    const progreso = req.app.db.get("progresos").find({ id: req.params.id }).value();
    
    if (!progreso) {
        return res.sendStatus(404);
    }

    res.send(progreso);
});

// Crear un nuevo progreso
router.post("/", (req, res) => {
    try {
        const progreso = {
            id: nanoid(idLength),
            ...req.body,
        };

        req.app.db.get("progresos").push(progreso).write();
        
        res.send(progreso);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un progreso
router.put("/:id", (req, res) => {
    try {
        const progreso = req.app.db
            .get("progresos")
            .find({ id: req.params.id });

        if (!progreso.value()) {
            return res.sendStatus(404);
        }

        progreso.assign(req.body).write();

        res.send(progreso.value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un progreso con su ID
router.delete("/:id", (req, res) => {
    req.app.db
        .get("progresos")
        .remove({ id: req.params.id })
        .write();

    res.sendStatus(200);
});

module.exports = router;                                                                                                                                                                    