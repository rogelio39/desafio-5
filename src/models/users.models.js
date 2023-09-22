import {Schema, model} from 'mongoose';
import paginate from 'mongoose-paginate-v2';


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true,
        // index : true
    },
    age : {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    }

})


userSchema.plugin(paginate); //implementar el metodo paginate en el schema

export const userModel = model('user', userSchema); //userModel seria igual al modelo de mi base de datos.

