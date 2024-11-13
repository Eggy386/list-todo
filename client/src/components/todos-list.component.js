import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from './navbar.component';

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'Alta': return 'bg-red-500';
        case 'Media': return 'bg-yellow-500';
        case 'Baja': return 'bg-green-600';
        default: return 'bg-gray-500';
    }
};

const Todo = (props) => {
    const isCompleted = props.todo.todo_completed;

    return (
        <div className={`shadow-md rounded-lg p-6 mb-4 border border-gray-500 ${isCompleted ? 'bg-gray-700' : 'bg-custom-conponents'}`}>
            <h3 className={`text-2xl font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                {props.todo.todo_description}
            </h3>
            <div className="mt-4 flex justify-between">
                <p className={`text-xl font-semibold  ${isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
                    {isCompleted ? 'Completado' : 'En Progreso'}
                </p>
                <span className={isCompleted ? 'hidden' : `px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(props.todo.todo_priority)}`}>
                    {props.todo.todo_priority}
                </span>
            </div>
            <div className="items-center mt-4">
                <p className='text-gray-500'>Responsable</p>
                <p className={`${isCompleted ? 'text-gray-400' : 'text-gray-200'} text-xl font-medium`}>
                    {props.todo.todo_responsible}
                </p>
            </div>
            <div className="flex items-center mt-4 justify-between">
                <button className={`border-2 rounded-md p-2 font-medium w-[45%] ${isCompleted ? 'hidden' : 'bg-custom-conponents border-blue-500 text-blue-500'}`}>
                    Eliminar
                </button>
                <Link to={`/edit/${props.todo._id}`} className={`rounded-md p-2 font-medium w-[45%] text-center ${isCompleted ? 'hidden' : 'bg-blue-500 text-gray-200'}`}>
                    Editar
                </Link>
            </div>
        </div>
    );
};

export default class TodosList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            isSubscribed: false  // Nueva variable de estado
        };
    }

    componentDidMount() {
        this.loadTodos();
    
        // Verificar si ya se ha suscrito
        if (!localStorage.getItem('isSubscribed')) {
            this.subscribeToNotifications();
            localStorage.setItem('isSubscribed', 'true'); // Marca que la suscripción fue hecha
        }
    }

    loadTodos() {
        const userId = localStorage.getItem('userId');
        const urlServer = process.env.REACT_APP_URL_SERVER;
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        axios.get(`${backendUrl}/todos/${userId}`)
            .then(res => {
                this.setState({
                    todos: res.data
                });
            })
            .catch(err => console.log(err));
    }

    async subscribeToNotifications() {
        const userId = localStorage.getItem('userId');
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.ready;
    
            // Verificar si ya existe una suscripción
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                console.log("El usuario ya está suscrito");
                return;  // Termina aquí si ya hay una suscripción
            }
    
            // Solicitar permiso para las notificaciones
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const newSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: "BF0R56KJLXyBC-WUGXWLFyuZmRhcCMn41E_rEGALwDugm0wN6PfIuCo2PzzlaDwvgvgTy_uheK-TDZ-llHWJ7dY"
                });
    
                const subscriptionData = {
                    ...newSubscription.toJSON(),
                    userId
                };
    
                const urlServer = process.env.REACT_APP_URL_SERVER;
                const backendUrl = process.env.REACT_APP_BACKEND_URL;
                await axios.post(`${backendUrl}/todos/suscription/add`, subscriptionData);
                console.log('Nueva suscripción guardada en la BD');
            } else {
                console.log("Permiso para notificaciones denegado");
            }
        } else {
            console.log("El navegador no soporta Service Workers o Push Notifications");
        }
    }    

    todoList = () => this.state.todos.map((todo, index) => <Todo todo={todo} key={index} />)

    render() {
        return (
            <div className="w-width-full bg-custom-background p-4">
                <NavBar />
                <h3 className="text-3xl font-bold mb-4 text-gray-200">Tareas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {this.todoList()}
                </div>
            </div>
        );
    }
}
