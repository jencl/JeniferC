const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

// Middleware para verificar si es UsuarioAdmin
function esUsuarioAdmin(req, res, next) {
    // Supongamos que req.user contiene información sobre el usuario autenticado
    // y tiene una propiedad UsuarioAdmin que indica si el usuario es administrador.
    const usuario = req.user; 

    if (usuario && usuario.UsuarioAdmin) {
        next(); // Si es UsuarioAdmin, continúa con la siguiente función
    } else {
        res.status(403).send("Acceso denegado. Necesitas permisos de administrador.");
    }
}

// Obtener la lista de artículos (disponible solo para UsuarioAdmin)
router.get("/", esUsuarioAdmin, (req, res) => {
    const articulos = req.app.db.get("articulos");
    res.send(articulos);
});

// Obtener un artículo por ID (disponible solo para UsuarioAdmin)
router.get("/:id", esUsuarioAdmin, (req, res) => {
    const articulo = req.app.db.get("articulos").find({ id: req.params.id }).value();
    
    if (!articulo) {
        res.sendStatus(404);
    } else {
        res.send(articulo);
    }
});

// Crear un nuevo artículo (solo UsuarioAdmin)
router.post("/", esUsuarioAdmin, (req, res) => {
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

// Actualizar un artículo (solo UsuarioAdmin)
router.put("/:id", esUsuarioAdmin, (req, res) => {
    try {
        req.app.db
            .get("articulos")
            .find({ id: req.params.id })
            .assign(req.body)
            .write();

        res.send(req.app.db.get("articulos").find({ id: req.params.id }).value());
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Eliminar un artículo por ID (solo UsuarioAdmin)
router.delete("/:id", esUsuarioAdmin, (req, res) => {
    try {
        req.app.db
            .get("articulos")
            .remove({ id: req.params.id })
            .write();

        res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;