import React, { Component } from 'react';
import NavBar from './navbar.component';

export default class CreateTodo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        }
    }

    // Funciones para manejar los cambios en los inputs
    onChangeTodoDescription = e => {
        this.setState({ todo_description: e.target.value });
    }

    onChangeTodoResponsible = e => {
        this.setState({ todo_responsible: e.target.value });
    }

    onChangeTodoPriority = e => {
        this.setState({ todo_priority: e.target.value });
    }

    // Función para manejar el envío del formulario
    onSubmit = async e => {
        e.preventDefault();
    
        const newTodo = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed,
            userId: localStorage.getItem('userId')
        };
    
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const urlLocal = process.env.REACT_APP_URL_SERVER
    
        try {
            const response = await fetch(`${backendUrl}/todos/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTodo)
            });
    
            if (!response.ok) throw new Error('Error en la API');
    
            const todoData = await response.json();
    
            // Enviar notificación push con descripción de la tarea
            await fetch(`${backendUrl}/todos/sendNotification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: newTodo.userId,
                    message: `La tarea ${newTodo.todo_description} se ha creado`
                })
            });
    
            console.log('Notificación enviada');
        } catch (error) {
            console.error('Error en la petición, guardando localmente:', error);
    
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(sw => sw.sync.register('sync-todos'));
            }
            
            await this.saveTodoToIndexedDB(newTodo);
        }
    
        this.setState({
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        });
    };    

    // Función para guardar los datos en IndexedDB
    saveTodoToIndexedDB(todo) {
        return new Promise((resolve, reject) => {
            let dbRequest = indexedDB.open('database');

            dbRequest.onupgradeneeded = event => {
                let db = event.target.result;
                if (!db.objectStoreNames.contains('todos')) {
                    db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
                }
            };

            dbRequest.onsuccess = event => {
                let db = event.target.result;
                let transaction = db.transaction(['todos'], 'readwrite');
                let store = transaction.objectStore('todos');
                let addRequest = store.add(todo);

                addRequest.onsuccess = () => {
                    resolve();
                };

                addRequest.onerror = () => {
                    reject('Error al guardar en IndexedDB');
                };
            };

            dbRequest.onerror = () => {
                reject('Error al abrir IndexedDB');
            };
        });
    }

    render() {
        return (
            <div className="w-width-full bg-custom-background p-4">
                <NavBar/>
                <div className='w-width-full flex items-center justify-center'>
                <div className='bg-custom-conponents p-4 w-[540px] rounded-lg'>
                <h3 className="text-3xl font-bold mb-8 text-gray-200 text-center">Crear Nueva Tarea</h3>
                <form onSubmit={this.onSubmit} className='text-gray-200 text-lg'>
                    <div className="my-4 flex flex-col">
                        <label className='mb-2'>Descripción: </label>
                        <input
                            type="text"
                            className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                            value={this.state.todo_description}
                            onChange={this.onChangeTodoDescription}
                        />
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className='mb-2'>Responsable: </label>
                        <input
                            type="text"
                            className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                            value={this.state.todo_responsible}
                            onChange={this.onChangeTodoResponsible}
                        />
                    </div>
                    <div className="my-4 flex flex-col">
                        <label className='mb-2'>Prioridad:</label>
                        <div className='flex justify-between'>
                        <div>
                            <input
                                className="mr-2"
                                type="radio"
                                name="priorityOptions"
                                id="priorityLow"
                                value="Baja"
                                checked={this.state.todo_priority === "Baja"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label>Baja</label>
                        </div>
                        <div>
                            <input
                                className="mr-2"
                                type="radio"
                                name="priorityOptions"
                                id="priorityMedium"
                                value="Media"
                                checked={this.state.todo_priority === "Media"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label>Media</label>
                        </div>
                        <div>
                            <input
                                className="mr-2"
                                type="radio"
                                name="priorityOptions"
                                id="priorityHigh"
                                value="Alta"
                                checked={this.state.todo_priority === "Alta"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label>Alta</label>
                        </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button type="submit" className='bg-blue-500 rounded-md p-2 font-medium text-gray-200 w-width-full text-center'>Crear Tarea</button>
                    </div>
                </form>
                </div>
                </div>
            </div>
        );
    }
}
