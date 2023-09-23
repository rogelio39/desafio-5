import { Router } from "express";
import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

const cartModelsRouter = Router();



cartModelsRouter.post('/', async (req, res) => {
    try {
        const createCart = await cartModel.create({});
        res.status(200).send({ respuesta: 'ok', mensaje: createCart });
    } catch (error) {
        res.status(500).send({ respuesta: 'error en crear carrito', mensaje: error })
    }
})



cartModelsRouter.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
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


cartModelsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid)
        if (cart) {
            //chequeamos si el producto existe en la base de datos.
            const product = await productModel.findById(pid);
            if (product) {
                //chequeamos si el producto existe en el carrito
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid);
                if (index != -1) {
                    cart.products[index].quantity += quantity;
                } else {
                    cart.products.push({ id_prod: pid, quantity: quantity });
                }
                //actualizamos el carrito
                const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                res.status(200).send({ respuesta: 'ok', mensaje: respuesta });

            } else {
                res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'product not found' });
            }
        } else {
            res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error })
    }
})


cartModelsRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid)
        if (cart) {
            //chequeamos si el producto existe en la base de datos.
            const product = await productModel.findById(pid);
            if (product) {
                //chequeamos si el producto existe en el carrito
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === pid);
                if (index != -1) {
                    cart.products.splice(index, 1);
                    //actualizamos el carrito
                    const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
                    res.status(200).send({ respuesta: 'producto eliminado', mensaje: respuesta });
                } else {
                    res.status(404).send({ respuesta: 'error', mensaje: 'producto no existente, error al tratar de borrarlo' })
                }
            } else {
                res.status(404).send({ respuesta: 'error al agregar eliminar el producto del carrito', mensaje: 'product not found' });
            }
        } else {
            res.status(404).send({ respuesta: 'error al eliminar producto del carrito', mensaje: 'Carrito no existe' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al eliminar producto del carrito', mensaje: error })
    }
})


cartModelsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        //chequeamos si el carrito existe y almacenamos ese valor en la variable cart
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).send({ respuesta: 'error al agregar producto al carrito', mensaje: 'Carrito no existe' });
        }

        const productPromises = products.map(async (prod) => {
            const product = await productModel.findById(prod._id);
            if (!product) {
                throw new Error(`Producto no encontrado: ${prod._id}`);
            }
            const index = cart.products.findIndex(cartProd => cartProd._id.toString() === product._id);
            if (index != -1) {
                throw new Error(`Producto ya existente: ${product._id.toString()}`);
            }
            return {id_prod: product._id};
        });

        try {
            // Esperamos a que se completen todas las promesas
            const productResults = await Promise.all(productPromises);
            // Si todos los productos se encontraron, actualizamos el carrito
            cart.products = productResults;
            const respuesta = await cartModel.findByIdAndUpdate(cid, { products: cart.products });
            res.status(200).send({ respuesta: 'ok', mensaje: respuesta });
        } catch (error) {
            res.status(404).send({ respuesta: 'error', mensaje: 'error al cargar array de productos' });
        }
    } catch (error) {
        res.status(500).send({ respuesta: 'error al agregar producto al carrito', mensaje: error.message })
    }
});



export default cartModelsRouter;