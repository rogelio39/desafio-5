import { Router } from "express";
import {productModel} from "../models/products.models.js";

const productRouter = Router();




productRouter.get('/', async (req, res) => {
    const { title, description, price, stock, category, code, limit, page, sort } = req.query;
    const options = {};

    if (sort === 'prices_desc') {
        options.sort = { price: -1 };
    } else if (sort === 'prices_crec') {
        options.sort = { price: 1 };
    } else {
        options.sort = {};
    }

    // Construye el objeto de consulta options.query en función de los parámetros proporcionados
    const query = {};

    if (title) {
        query.title = title;
    }

    if (description) {
        query.description = description;
    }

    if (price) {
        query.price = price;
    }

    if (stock) {
        query.stock = stock;
    }

    if (category) {
        query.category = category;
    }

    if (code) {
        query.code = code;
    }

    options.query = query;

    try {
        const prods = await productModel.paginate(options.query, { limit: limit ?? 10, page: page ?? 1, sort: options.sort });
        console.log(options);
        console.log(title);
        res.status(200).send({ respuesta: 'ok', message: prods });
    } catch (error) {
        res.status(400).send({ respuesta: "error en consultar productos", mensaje: error });
    }
});



productRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const prod = await productModel.findById(id);
        if(prod){
            res.status(200).send({respuesta : 'ok', message: prod})
        } else {
            res.status(404).send({respuesta : "Error en encontrar el producto", mensaje: "not found"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en consultar productos", mensaje: error});
    }
});


productRouter.post('/', async (req, res) => {
    const { title, description, price,code, stock, category } = req.body;
    try {
        const prod = await productModel.create({title, description, price, code, stock, category});

        res.status(200).send({ respuesta: 'ok', mensaje: prod });
        
    } catch (error) {
        res.status(400).send({ respuesta: "error en crear producto", mensaje: error });
    }
})

productRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, description, price, code, status, stock, category } = req.body;
    try{
        const prod = await productModel.findByIdAndUpdate(id, {title, description, price, code, status, stock, category });
        if(prod){
            res.status(200).send({respuesta : 'ok', message: 'producto actualizado'})
        } else {
            res.status(404).send({respuesta : "Error en actualizar el producto", mensaje: "error"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en actualizar productos", mensaje: error});
    }
});

productRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{ 
        const prod = await productModel.findByIdAndDelete (id);
        if(prod){
            res.status(200).send({respuesta : 'ok', message: 'producto eliminado'})
        } else {
            res.status(404).send({respuesta : "Error en eliminar el producto", mensaje: "not found"});
        }
    }catch(error){
        res.status(400).send({respuesta : "error en eliminar productos", mensaje: error});
    }
});




export default productRouter;