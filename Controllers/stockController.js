const Products = require('../Models/products')
const mongoose = require('mongoose');
const Stocks = require('../Models/stock');

exports.AddStock = async (req, res) => {
    const {quantity, ProductID} = req.body

    if(!quantity || !ProductID){
        return res.status(400).json({msg: 'Preencha todos os campos'})
    }

    const productID = await Products.findOne({ _id: ProductID });
    if(!productID){
        return res.status(400).json({msg: 'ID de produto inválido'})
    }

    const stockExists = await Stocks.findOne({ ProductID: productID._id});
    if(stockExists.quantity != 0){
        return res.status(400).json({msg: 'Produto ja possui stock'})
    }else{
        const stock = await Stocks.create({
            quantity,
            ProductID: productID._id
        })
        res.json({status:'success', Stocks: stock})
    }
}

exports.EditStock = async (req, res) => {
    const {newQuantity, ProductID} = req.body
    if(!newQuantity || !ProductID){
        return res.status(400).json({msg: 'Preencha todos os campos'})
    }

    const productID = await Products.findOne({ _id: ProductID });
    if(!productID){
        return res.status(400).json({msg: 'ID de produto inválido'})
    }

    const stockExists = await Stocks.findOne({ ProductID: productID._id });
    if(!stockExists){
        return res.status(400).json({msg: 'Produto não possui stock'})
    }

    const stock = await Stocks.findOneAndUpdate(stockExists, { quantity: newQuantity });
    res.json({status:'success', Stocks: stock})
}

exports.RemoveStock = async (req, res) => {
    const {ProductID} = req.query
    if(!ProductID){
        return res.status(400).json({msg: 'Preencha todos os campos'})
    }

    const productID = await Products.findOne({ _id: ProductID });
    if(!productID){
        return res.status(400).json({msg: 'ID de produto inválido'})
    }

    const stockExists = await Stocks.findOne({ ProductID: productID._id });
    if(!stockExists){
        return res.status(400).json({msg: 'Produto não possui stock'})
    }

    const stock = await Stocks.deleteOne(stockExists);

    res.json({status:'success', Stocks: stock})
}

exports.ReadStock = async (req, res) => {
    const { ProductID } = req.query;

    if (!ProductID) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const productID = await Products.findOne({ _id: ProductID });
    if (!productID) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    const stock = await Stocks.findOne({ ProductID: productID._id });
    if (!stock) {
        return res.status(404).json({ msg: 'Stock not found' });
    }

    res.json({ status: 'success', stock: stock.quantity })
}