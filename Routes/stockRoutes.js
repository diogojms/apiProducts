const router = require('express').Router()
const stockController = require('../Controllers/stockController')
const jwt = require('jsonwebtoken')

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Token inválida" });
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(401).json({ msg: "Erro na verificação do token", error: err.message });
    }
}

function isAdminOrStaff(req, res, next) {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const tokenData = jwt.verify(token[1], process.env.SECRET);

    if(tokenData.role == 3 || tokenData.role == 2)
        next()
    else
        res.status(403).json()
}

router.post('/AddStock', checkToken, isAdminOrStaff, stockController.AddStock)
router.post('/EditStock', checkToken, stockController.EditStock)
router.post('/RemoveStock/', checkToken, isAdminOrStaff, stockController.RemoveStock)
router.get('/ReadStock/', checkToken, isAdminOrStaff, stockController.ReadStock)

module.exports = router;