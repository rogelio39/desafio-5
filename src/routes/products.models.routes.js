import { Router } from "express";
import {productModel} from "../models/products.models.js";

const productRouter = Router();


productRouter.get('/', async (req, res) => {
    const {limit} = req.query;

    try{
        const prods = await productModel.find().limit(limit);
        res.status(200).send({respuesta : 'ok', message: prods})
    }catch(error){
        res.status(400).send({respuesta : "error en consultar productos", mensaje: error});
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