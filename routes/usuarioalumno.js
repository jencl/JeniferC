const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Obtener la lista de usuarios-alumnos
router.get("/", (req, res) => {
    const usuariosAlumnos = req.app.db.get("usuariosAlumnos");

    res.send(usuariosAlumnos);
});

// Obtener un usuario-alumno desde la ID
router.get("/:id", (req, res) => {
    const usuarioAlumno = req.app.db.get("usuariosAlumnos").find({ id: req.params.id }).value();
    
    if (!usuarioAlumno) {
        res.sendStatus(404);
    }

    res.send(usuarioAlumno);
});

// Crear un nuevo usuario-alumno
router.post("/", (req, res) => {
    try {
        const usuarioAlumno = {
            id: nanoid(idLength),
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            idioma: req.body.idioma,
            nivel: req.body.nivel,
        };

        req.app.db.get("usuariosAlumnos").push(usuarioAlumno).write();
        
        res.send(usuarioAlumno);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Actualizar un usuario-alumno
router.put("/:id", (req, res) => {
    try {
        req.app.db
        .get("usuariosAlumnos")
        .find({ id: req.params.id })
        .assign(req.body)
        .write();

        res.send(req.app.db.get("usuariosAlumnos").find({ id: req.params.id }));
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un usuario-alumno con su ID
router.delete("/:id", (req, res) => {
    req.app.db
    .get("usuariosAlumnos")
    .remove({ id: req.params.id })
    .write();

    res.sendStatus(200);
});

module.exports = router;