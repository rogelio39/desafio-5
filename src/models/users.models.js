import {Schema, model} from 'mongoose';

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


export const userModel = model('user', userSchema); //userModel seria igual al modelo de mi base de datos.