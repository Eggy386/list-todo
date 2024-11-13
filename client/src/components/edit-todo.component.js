import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './navbar.component';

const EditTodo = () => {
    const { id } = useParams();
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate();
    const [todo, setTodo] = useState({
        todo_description: '',
        todo_responsible: '',
        todo_priority: '',
        todo_completed: false
    });

    console.log(id)

    useEffect(() => {
        const urlServer = process.env.REACT_APP_URL_SERVER;
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        axios.get(`${backendUrl}/todos/todo/${id}`)
            .then(res => {
                console.log(res)
                setTodo({
                    todo_description: res.data.todo_description || '',
                    todo_responsible: res.data.todo_responsible || '',
                    todo_priority: res.data.todo_priority || '',
                    todo_completed: res.data.todo_completed || false
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const onChangeTodoDescription = (e) => {
        setTodo({ ...todo, todo_description: e.target.value });
    };

    const onChangeTodoResponsible = (e) => {
        setTodo({ ...todo, todo_responsible: e.target.value });
    };

    const onChangeTodoPriority = (e) => {
        setTodo({ ...todo, todo_priority: e.target.value });
    };

    const onChangeTodoCompleted = () => {
        setTodo({ ...todo, todo_completed: !todo.todo_completed });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const obj = {
            todo_description: todo.todo_description,
            todo_responsible: todo.todo_responsible,
            todo_priority: todo.todo_priority,
            todo_completed: todo.todo_completed
        };
        const urlServer = process.env.REACT_APP_URL_SERVER;
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        axios.post(`${backendUrl}/todos/update/${id}`, obj)
            .then(() => navigate(`/${userId}`))
            .catch(err => {
                alert("Error al actualizar la tarea")
                console.log(err)
            });
    };

    return (
        <div className="w-width-full bg-custom-background p-4">
            <NavBar/>
            <div className='flex justify-center items-center'>
            <div className='bg-custom-conponents p-4 w-[540px] rounded-lg'>
                <h3 className="text-3xl font-bold mb-8 text-gray-200 text-center">Actualizar Tarea</h3>
                <form onSubmit={onSubmit} className='text-gray-200 text-lg'>
                <div className="my-4 flex flex-col">
                            <label className='mb-2'>Descripción: </label>
                            <input type="text" 
                                   className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                                   value={todo.todo_description || ''}
                                   onChange={onChangeTodoDescription}
                            />
                        </div>
                        <div className="my-4 flex flex-col">
                            <label className='mb-2'>Responsable: </label>
                            <input type="text" 
                                   className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                                   value={todo.todo_responsible || ''}
                                   onChange={onChangeTodoResponsible}
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
                                        checked={todo.todo_priority === "Baja"}
                                        onChange={onChangeTodoPriority}
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
                                        checked={todo.todo_priority === "Media"}
                                        onChange={onChangeTodoPriority}
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
                                        checked={todo.todo_priority === "Alta"}
                                        onChange={onChangeTodoPriority}
                                    />
                                    <label>Alta</label>
                                </div>
                            </div>
                        </div> 
                        <div className="my-4">
                            <input  
                                type="checkbox"
                                className="mr-2"
                                id="completedCheckbox"
                                name="completedCheckbox"
                                onChange={onChangeTodoCompleted}
                                checked={todo.todo_completed || false}
                            />
                            <label htmlFor="completedCheckbox" className='text-xl font-bold'>Completada</label>
                        </div>
                    <div className="mt-4">
                        <button type="submit" className='bg-blue-500 rounded-md p-2 font-medium text-gray-200 w-width-full text-center'>Actualizar</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}

export default EditTodo;
