import {Schema, model} from 'mongoose';


const cartSchema = new Schema({
    products: [
        {
            id_prod : { 
                type : Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})





export const cartModel = model('carts', cartSchema)