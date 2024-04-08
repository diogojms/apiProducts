const Products = require('../Models/products')
const mongoose = require('mongoose');
const Stocks = require('../Models/stock');

/**
 * @swagger
 * /AddStock/{id}:
 *   post:
 *     summary: Add stock to a product
 *     description: Endpoint to add stock to an existing product.
 *     tags:
 *       - Stocks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to add stock
 *         required: true
 *         schema:
 *           type: string
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
 *             required:
 *               - quantity
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
    const { quantity } = req.body;
    const { id } = req.params;

    if (!quantity) {
        return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    try {
        const product = await Products.findOne({ _id: id });
        if (!product) {
            return res.status(400).json({ msg: 'ID de produto inválido' });
        }

        const stockExists = await Stocks.findOne({ ProductID: product._id });
        if (stockExists && stockExists.quantity !== 0) {
            return res.status(400).json({ msg: 'Produto já possui stock' });
        }

        const stock = await Stocks.create({
            quantity,
            ProductID: product._id
        });

        res.json({ status: 'success', Stocks: stock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
}

/**
 * @swagger
 * /EditStock/{id}:
 *   put:
 *     summary: Edit stock for a product
 *     description: Endpoint to edit the stock quantity for an existing product.
 *     tags:
 *       - Stocks
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to edit the stock
 *         required: true
 *         schema:
 *           type: string
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
 *             required:
 *               - newQuantity
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
    const { newQuantity } = req.body;
    const { id } = req.params;

    if (!newQuantity) {
        return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    try {
        const product = await Products.findOne({ _id: id });

        if (!product) {
            return res.status(400).json({ msg: 'ID de produto inválido' });
        }

        const stock = await Stocks.findOne({ ProductID: product._id });

        if (!stock) {
            return res.status(400).json({ msg: 'Produto não possui stock' });
        }

        const updatedStockQuantity = stock.quantity - newQuantity;

        const updatedStock = await Stocks.findOneAndUpdate(
            { ProductID: product._id },
            { $set: { quantity: updatedStockQuantity } },
            { new: true }
        );

        res.json({ status: 'success', Stocks: updatedStock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

/**
 * @swagger
 * /RemoveStock/:
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
    const {ProductID} = req.params
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
 * /ReadStock/:
 *   get:
 *     summary: Get stock information for a product
 *     description: Endpoint to retrieve stock information for an existing product.
 *     tags:
 *       - Stocks
 *     parameters:
 *       - name: id
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
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const productID = await Products.findOne({ _id: id });
    if (!productID) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    const stock = await Stocks.findOne({ ProductID: productID._id });
    if (!stock) {
        return res.status(404).json({ msg: 'Stock not found' });
    }

    res.json({ status: 'success', stock: stock.quantity })
}

exports.updateStock = async (req, res) => {
    try {
        const {newQuantity, ProductID} = req.body
  
      if (isNaN(newQuantity) || newQuantity < 0) {
        return apiResponse.send(
          res,
          apiResponse.createModelRes(400, "Invalid quantity", {})
        );
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(
        ProductID,
        { $inc: { stock: -newQuantity } },
        { new: true }
      );
  
      if (!updatedProduct) {
        return apiResponse.send(
          res,
          apiResponse.createModelRes(404, "Product not found", {})
        );
      }
  
      return apiResponse.send(
        res,
        apiResponse.createModelRes(200, "Stock updated", updatedProduct)
      );
    } catch (error) {
      console.error(error);
      return apiResponse.send(
        res,
        apiResponse.createModelRes(500, "Error updating stock", {})
      );
    }
  };