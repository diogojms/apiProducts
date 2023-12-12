const Products = require('../Models/products')
const mongoose = require('mongoose');
const Stocks = require('../Models/stock');

/**
 * @swagger
 * /stocks/add:
 *   post:
 *     summary: Add stock to a product
 *     description: Endpoint to add stock to an existing product.
 *     tags:
 *       - Stocks
 *     requestBody:
 *       description: Stock addition data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *               ProductID:
 *                 type: string
 *             required:
 *               - quantity
 *               - ProductID
 *     responses:
 *       '200':
 *         description: Stock added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Stocks:
 *                   type: object
 *                   // Define your stock properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to add stock to the product
 */
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

/**
 * @swagger
 * /stocks/edit:
 *   put:
 *     summary: Edit stock for a product
 *     description: Endpoint to edit the stock quantity for an existing product.
 *     tags:
 *       - Stocks
 *     requestBody:
 *       description: Stock editing data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newQuantity:
 *                 type: integer
 *               ProductID:
 *                 type: string
 *             required:
 *               - newQuantity
 *               - ProductID
 *     responses:
 *       '200':
 *         description: Stock edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Stocks:
 *                   type: object
 *                   // Define your stock properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to edit stock for the product
 */
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

/**
 * @swagger
 * /stocks/remove:
 *   delete:
 *     summary: Remove stock for a product
 *     description: Endpoint to remove the stock for an existing product.
 *     tags:
 *       - Stocks
 *     parameters:
 *       - name: ProductID
 *         in: query
 *         description: ID of the product to remove the stock
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Stock removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Stocks:
 *                   type: object
 *                   // Define your stock properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to remove stock for the product
 */
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

/**
 * @swagger
 * /stocks/read:
 *   get:
 *     summary: Get stock information for a product
 *     description: Endpoint to retrieve stock information for an existing product.
 *     tags:
 *       - Stocks
 *     parameters:
 *       - name: ProductID
 *         in: query
 *         description: ID of the product to retrieve stock information
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Stock information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 stock:
 *                   type: integer
 *       '400':
 *         description: Bad Request - Invalid product ID
 *       '404':
 *         description: Not Found - Product or stock not found
 *       '500':
 *         description: Internal Server Error - Failed to retrieve stock information
 */
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