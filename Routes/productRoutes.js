const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController')
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

function isAdmin(req, res, next) {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const tokenData = jwt.verify(token[1], process.env.SECRET);

    if(tokenData.role == 3)
        next()
    else
        res.status(403).json() 
}

router.post('/CreateProduct', checkToken, isAdmin, productController.CreateProduct)
router.post('/EditProductName/:id', checkToken, isAdmin, productController.EditProductName)
router.post('/EditProductPrice/:id', checkToken, isAdmin, productController.EditProductPrice)
router.post('/RemoveProduct/:id', checkToken, isAdmin, productController.RemoveProduct)
router.get('/ReadProduct/:id', productController.ReadProduct)
router.get('/ReadProducts', productController.ReadProducts)

module.exports = router;