const Products = require('../Models/products');
const mongoose = require('mongoose');
const Product = require('../Models/products');

/**
 * @swagger
 * /CreateProduct:
 *   post:
 *     summary: Create a new product
 *     description: Endpoint to create a new product with the provided name, price, and quantity.
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
 *               quantity:
 *                 type: number
 *             required:
 *               - name
 *               - price
 *               - quantity
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
 *                 product:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '500':
 *         description: Internal Server Error - Failed to create the product
 */
exports.CreateProduct = async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || !price || !quantity)
        return res.status(400).json({ msg: 'Preencha todos os campos' });

    const response = await Products.create({
        name,
        price,
        quantity
    });

    res.json({ status: 'success', product: response });
};

/**
 * @swagger
 * /EditProduct/:
 *   put:
 *     summary: Edit product
 *     description: Endpoint to edit the fields of an existing product.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: productID
 *         in: query
 *         description: ID of the product to edit
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Product fields to be updated
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
 *               quantity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Product edited successfully
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
 *       '400':
 *         description: Bad Request - Invalid or missing input data
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to edit product
 */
exports.EditProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica se o ID do produto é válido
        if (!id) {
            return res.status(400).json({ msg: 'ID de produto inválido' });
        }

        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ msg: 'Produto não encontrado' });
        }

        // Atualiza os campos do produto pelo ID
        const updatedProduct = await Products.findByIdAndUpdate(id, req.body, { new: true });

        res.json({ status: 'success', product: updatedProduct });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

/**
 * @swagger
 * /RemoveProduct:
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *       '400':
 *         description: Bad Request - Invalid product ID
 *       '404':
 *         description: Not Found - Product not found
 *       '500':
 *         description: Internal Server Error - Failed to remove the product
 */
exports.RemoveProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const product = await Products.findById(id);

    if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    await Products.deleteOne(product);

    res.json({ status: 'success', product: product });
};

/**
 * @swagger
 * /ReadProduct/:
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
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Invalid product ID' });
    }

    const product = await Products.findById(id);
    if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
    }

    var stock = "Tem stock";
    if (product.quantity <= 0) {
        stock = "Sem stock";
    }

    res.json({ status: 'success', product: product, stock: stock });
};

/**
 * @swagger
 * /ReadProducts:
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
 *       '500':
 *         description: Internal Server Error - Failed to retrieve products information
 */
exports.ReadProducts = async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;

    const products = await Products.find().skip(startIndex).limit(limitNumber);

    const totalProducts = await Products.countDocuments();

    const totalPages = Math.ceil(totalProducts / limitNumber);

    const pagination = {
        currentPage: pageNumber,
        totalPages: totalPages,
        totalProducts: totalProducts
    };

    res.json({ status: 'success', products: products, pagination: pagination });
};
