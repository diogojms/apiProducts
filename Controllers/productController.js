const Products = require('../Models/products')
const mongoose = require('mongoose');
const Stocks = require('../Models/stock');
const Product = require('../Models/products');

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Endpoint to create a new product with the provided name and price.
 *     tags:
 *       - Products
 *     requestBody:
 *       description: Product creation data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *     responses:
 *       '200':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Products:
 *                   type: object
 *                   // Define your product properties here
 *                 Stocks:
 *                   type: object
 *                   // Define your stock properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to create the product
 */
exports.CreateProduct = async (req, res) => {
    const {name, price} = req.body

    if(!name || !price)
        return res.status(400).json({msg: 'Preencha todos os campos'})

    const response = await Products.create({
        name,
        price
    })

    const stock = await Stocks.create({
        quantity: 0,
        ProductID: response._id
    })
    res.json({status:'success', Products: response, Stocks: stock})
}
/**
 * @swagger
 * /products/editName:
 *   put:
 *     summary: Edit product name
 *     description: Endpoint to edit the name of an existing product.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the product to edit
 *         required: true
 *         schema:
 *           type: string
 *       - name: newName
 *         in: body
 *         description: New name for the product
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newName:
 *               type: string
 *     responses:
 *       '200':
 *         description: Product name edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 Products:
 *                   type: object
 *                   // Define your product properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to edit product name
 */  
exports.EditProductName = async (req, res) => {
    try {
        const { newName } = req.body;
        const { id } = req.query;

        // Verifica se o ID é válido
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ msg: 'ID de produto inválido' });
        }

        // Verifica se o campo 'name' está presente
        if (!newName) {
            return res.status(400).json({ msg: 'O campo "name" é obrigatório' });
        }

        // Atualiza o produto pelo ID
        const updatedProduct = await Product.findByIdAndUpdate(id, { name: newName }, { new: true });

        // Verifica se o produto foi encontrado e atualizado
        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        // Responde com sucesso e os detalhes do produto atualizado
        res.json({ status: 'success', Products: updatedProduct });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /products/editPrice:
 *   put:
 *     summary: Edit product price
 *     description: Endpoint to edit the price of an existing product.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: productID
 *         in: query
 *         description: ID of the product to edit the price
 *         required: true
 *         schema:
 *           type: string
 *       - name: newPrice
 *         in: body
 *         description: New price for the product
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPrice:
 *               type: number
 *     responses:
 *       '200':
 *         description: Product price edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 product:
 *                   type: object
 *                   // Define your product properties here
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to edit product price
 */
exports.EditProductPrice = async (req, res) => {
    try {
        const { newPrice } = req.body;
        const { productID } = req.query;

        // Verifica se o ID do produto é válido
        if (!productID || !newPrice){
            return res.status(400).json({ msg: 'ID de produto ou novo preço inválido' });
        }

        const product = await Products.findById(productID);
        if (!product) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        // Atualiza o preço do produto pelo ID

        const updatedProduct = await Products.findByIdAndUpdate(productID, { price:newPrice }, { new: true });

        res.json({ status: 'success', product: updatedProduct });
    } catch (error) {
        console.error('Erro ao atualizar o preço do produto:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /products/remove:
 *   delete:
 *     summary: Remove a product
 *     description: Endpoint to remove an existing product.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: productID
 *         in: query
 *         description: ID of the product to be removed
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 product:
 *                   type: object
 *                   // Define your product properties here
 *                 stock:
 *                   type: object
 *                   // Define your stock properties here
 *       '400':
 *         description: Bad Request - Invalid product ID
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to remove the product
 */
exports.RemoveProduct = async (req, res) => {
    const { productID } = req.query;

    if (!productID) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const product = await Products.findById(productID);

    if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    const stock = await Stocks.findOneAndDelete({ ProductID: product._id });
    await Products.deleteOne(product);

    res.json({ status: 'success', product: product, stock: stock });
}

/**
 * @swagger
 * /products/read:
 *   get:
 *     summary: Get product information
 *     description: Endpoint to retrieve information about an existing product.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: productID
 *         in: query
 *         description: ID of the product to retrieve information
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 product:
 *                   type: object
 *                   // Define your product properties here
 *                 stock:
 *                   type: string
 *                   description: Stock status ('Tem stock' or 'Sem stock')
 *       '400':
 *         description: Bad Request - Invalid product ID
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to retrieve product information
 */
exports.ReadProduct = async (req, res) => {
    const { productID } = req.query;

    if (!productID) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const product = await Products.findById(productID);
    if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    const productStock = await Stocks.findOne({ ProductID: product._id });

    var stock = "Tem stock"
    if (productStock.quantity <= 0) {
        stock = "Sem stock"
    }

    res.json({ status: 'success', product: product, stock: stock })
}

/**
 * @swagger
 * /products/readAll:
 *   get:
 *     summary: Get all products
 *     description: Endpoint to retrieve information about all existing products.
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: Products information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [success]
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     // Define your product properties here
 *       '500':
 *         description: Internal Server Error - Failed to retrieve products information
 */
exports.ReadProducts = async (req, res) => {
    const products = await Products.find();
    res.json({ status: 'success', products: products })
}

