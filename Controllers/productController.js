const Products = require('../Models/products')
const mongoose = require('mongoose');
const Stocks = require('../Models/stock');
const Product = require('../Models/products');

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

exports.ReadProducts = async (req, res) => {
    const products = await Products.find();
    res.json({ status: 'success', products: products })
}

