import { Router } from "express";
import { cartModel } from "../models/carts.models";
import cartRouter from "./cart.routes";
import { productModel } from "../models/products.models";

const cartModelsRouter = Router();



cartModelsRouter.get('/:cid', async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartModel.findById(cid)
        if (cart) {
            res.status(200).send({ respuesta: 'ok', mensaje: cart });
        } else {
            res.status(404).send({ respuesta: 'error al consultar carrito', mensaje: 'error' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al consultar carrito', mensaje: error })
    }

})


cartModelsRouter.post('/', async (req, res) => {
    try {
        const createCart = await cartModel.create();
        res.status(200).send({ respuesta: 'ok', mensaje: createCart });
    } catch (error) {
        res.status(500).send({ respuesta: 'error en crear carrito', mensaje: error })
    }
})


cartModelsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid)
        if (cart) {
            //chequeamos si el producto existe en la base de datos.
            const product = productModel.findById(pid);
            if (product) {
                //chequeamos si el producto existe en el carrito
                const index = cart.products.findIndex(prod => prod.id_prod === pid);
                if (index != -1) {
                    cart.products[index].quantity = quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }
                //actualizamos el carrito
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
                res.status(200).send({ respuesta: 'ok', mensaje: respuesta});
            }
            else {
                res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'product not found' });
            }
        } else {
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error })
    }
})


export default cartRouter;