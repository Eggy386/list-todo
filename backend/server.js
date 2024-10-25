const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
let Todo = require('./todo.model');
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

todoRoutes.route('/:id').get((req,res) => {
    const id = req.params.id;
    Todo.findById(id, (err,todo) => {
        res.json(todo);
    });
});

todoRoutes.route('/add').post((req,res) => {
    console.log(req.body);
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
    const suscription = new suscriptionModel(req.body);
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
