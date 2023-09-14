import express from "express";
import multer from "multer";
import { Server } from "socket.io";
import mongoose from "mongoose";

import path from 'path';
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";


import { ProductsManager } from "./controllers/productsManager.js";
import { Products } from "./models/products.js";

const productManager = new ProductsManager();


import { messageModel } from "./models/messages.models.js";


//rutas productos
import prodsRouter from "./routes/products.routes.js";

//rutas cart
import cartRouter from "./routes/cart.routes.js";
import userRouter from "./routes/users.routes.js";
import productRouter from "./routes/products.models.routes.js";

const PORT = 4000;

const app = express();

let userEmail;

//config multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'src/public/img');
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()} ${file.originalname}`)
    }
});

const server = app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
const upload = multer({ storage: storage });
//ruta para imagenes

//aqui se deben concatenar las rutas.
app.use('/static', express.static(path.join(__dirname, '/public')));

//conectando mongoDB atlas con visual studio code.
mongoose.connect('mongodb+srv://andresrogesu:Lour1618@cluster0.lwz3su9.mongodb.net/?retryWrites=true&w=majority').then(() => {
    console.log('DB is connected')
}).catch(() => console.log('error en conexion a DB'));


//server socket.io
const io = new Server(server);
//lado del servidor
io.on('connection', async (socket) => {
    console.log('servidor Socket.io connected');

    const productos = await productManager.getProducts();
    socket.emit('prods', productos);

    socket.on('nuevoProducto', async (nuevoProd) => {
        const { title, description, price, code, stock, category } = nuevoProd;
        const newProduct = new Products(title, description, price, code, true, stock, category, []);
        productManager.addProduct(newProduct);
        socket.emit('prod', newProduct);
    });

    socket.on('message', async (messageInfo) => {
        const { email, message } = messageInfo;
        try {
            await messageModel.create({ email, message });
            const messages = await messageModel.find();
            userEmail = messages.email;
            socket.emit('messages', messages);
        } catch (error) {
            console.log('error', error);
        }
    })



})


//routes productos
app.use('/api/products', prodsRouter);

//routes cart
app.use('/api/carts', cartRouter);

//routes users 
app.use('/api/users', userRouter);

//routes products con mongo
app.use('/api/prods', productRouter);

app.get('/static', async (req, res) => {

    res.render('chat', {
        css: "chat.css",
        title: "chat",
        js: 'main.js',
        user: userEmail
    })
})

//este es el endpoint en el que me voy a conectar a mi aplicacion
app.post('/upload', upload.single('product'), (req, res) => {
    res.status(200).send('imagen cargada');
})