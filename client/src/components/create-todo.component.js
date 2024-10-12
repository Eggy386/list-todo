import React, { Component } from 'react';

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
    onSubmit = e => {
        e.preventDefault();

        const newTodo = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed
        };

        // Intenta enviar los datos al servidor
        fetch('http://localhost:4000/todos/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la API');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error en la petición, guardando localmente:', error);
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(sw => {
                    return sw.sync.register('sync-todos');
                }).then(() => {
                    console.log('Sincronización registrada');
                }).catch(err => console.error('Error al registrar la sincronización:', err));
            }            
            // Guardar en IndexedDB si la petición falla
            this.saveTodoToIndexedDB(newTodo)
                .then(() => {
                    console.log('Tarea guardada en IndexedDB debido a la falla en la red');
                })
                .catch(err => console.error('Error al guardar en IndexedDB:', err));
        });

        this.setState({
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        })
    }

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
            <div style={{ marginTop: 20 }}>
                <h3>Crear Nueva Tarea</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Descripción: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.todo_description}
                            onChange={this.onChangeTodoDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>Responsable: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.todo_responsible}
                            onChange={this.onChangeTodoResponsible}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityLow"
                                value="Baja"
                                checked={this.state.todo_priority === "Baja"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">Baja</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityMedium"
                                value="Media"
                                checked={this.state.todo_priority === "Media"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">Media</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="priorityOptions"
                                id="priorityHigh"
                                value="Alta"
                                checked={this.state.todo_priority === "Alta"}
                                onChange={this.onChangeTodoPriority}
                            />
                            <label className="form-check-label">Alta</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Crear Tarea" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        );
    }
}
