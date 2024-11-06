const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');
let User = require('./user.model')
const suscriptionModel = require('./suscription.model');
const { sendPush } = require('./pushServer');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://edgarAlvar:13fkjZ855oJbNAUD@cluster0.vrxx0za.mongodb.net/dbTodos', { useNewUrlParser: true });
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

todoRoutes.route('/').get( (req,res) => {
    Todo.find((err, todos) => {
        if(err)
            console.log(err);
        else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/register').post(async (req, res) => {
    const { nombre, correo_electronico, contrasena } = req.body;
  
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ correo_electronico });
      if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
  
      // Crear un nuevo usuario sin encriptación
      const user = new User({
        nombre,
        correo_electronico,
        contrasena
      });
      await user.save();
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  });
  
  // Inicio de sesión
  todoRoutes.route('/login').post(async (req, res) => {
    const { correo_electronico, contrasena } = req.body;
  
    try {
      // Buscar al usuario en la base de datos y verificar la contraseña
      const user = await User.findOne({ correo_electronico });
      if (!user || user.contrasena !== contrasena) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
      }
  
      // Responder con confirmación de autenticación sin tokens
      res.json({ message: 'Inicio de sesión exitoso', usuario: user });
    } catch (error) {
      res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
  });

// Obtener los to-dos del usuario autenticado
todoRoutes.route('/:userId').get(async (req, res) => {
    const userId = req.params.userId;

    try {
        const todos = await Todo.find({ userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

todoRoutes.route('/todo/:id').get(async (req, res) => {
    const id = req.params.id;

    try {
        const todo = await Todo.findById(id); // Usa findById para buscar por _id directamente
        if (!todo) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(todo); // Devuelve directamente el objeto, no en un array
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
});


todoRoutes.route('/add').post((req,res) => {
    const todo = new Todo(req.body);
    todo.save()
        .then( todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch( err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/suscription/add').post((req,res) => {
    // Crea una nueva suscripción con los datos del cuerpo de la solicitud, que ahora incluye `userId`
    const suscription = new suscriptionModel({
        endpoint: req.body.endpoint,
        expirationTime: req.body.expirationTime,
        keys: req.body.keys,
        userId: req.body.userId // Asigna el userId desde el req.body
    });
    suscription.save()
    .then( suscription => {
        res.status(200).json({'suscription': 'suscription added successfully'});
    })
    .catch( err => {
        res.status(400).send('adding new suscription failed');
    });
})

// Ruta para enviar una notificación push
todoRoutes.route('/sendPush').post((req, res) => {
    const pushSubscription = req.body; 

    sendPush(pushSubscription)
        .then(res => {
            res.status(200).json({ message: 'Push notification sent successfully.' });
        })
        .catch(err => {
            res.status(500).json({ error: 'Failed to send push notification.' });
        });
});

todoRoutes.route('/update/:id').post((req,res) => {
    Todo.findById(req.params.id, (err, todo) => {
        if(!todo)
            res.status(404).send('Data is not found');
        else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then( todo => {
                res.json('Todo updated');
            })
            .catch( err => {
                res.status(400).send("Update not possible");
            });
        }
    });
});

app.use('/todos', todoRoutes);

app.listen( PORT, () => {
    console.log("Server is running on port " + PORT);
});
