import React , { Component } from 'react';
import axios from 'axios';

export default class EditTodo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_completed: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/todos/' + this.props.match.params.id)
            .then( res => {
                this.setState({
                    todo_description: res.data.todo_description,
                    todo_responsible: res.data.todo_responsible,
                    todo_priority: res.data.todo_priority,
                    todo_completed: res.data.todo_completed
                })
            })
            .catch( err => console.log(err));
    }

    onChangeTodoDescription = (e) => {
        this.setState({
            todo_description: e.target.value
        });
    }

    onChangeTodoResponsible = (e) => {
        this.setState({
            todo_responsible: e.target.value
        });
    }

    onChangeTodoPriority = (e) => {
        this.setState({
            todo_priority: e.target.value
        });
    }

    onChangeTodoCompleted = (e) => {
        this.setState({
            todo_completed: !this.state.todo_completed
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const obj = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_completed: this.state.todo_completed
        };
        axios.post('http://localhost:4000/todos/update/' + this.props.match.params.id, obj)
            .then( res => console.log(res.data));

        this.props.history.push('/');
    }

    render() {
        return (
            <div className="w-width-full bg-custom-background p-4 flex justify-center items-center">
                <div className='bg-custom-conponents p-4 w-[540px] rounded-lg'>
                    <h3 className="text-3xl font-bold mb-8 text-gray-200 text-center">Actualizar Tarea</h3>
                    <form onSubmit={this.onSubmit} className='text-gray-200 text-lg'>
                        <div className="my-4 flex flex-col">
                            <label className='mb-2'>Descripción: </label>
                            <input type="text" 
                                    className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                                    value={this.state.todo_description}
                                    onChange={this.onChangeTodoDescription}
                                    />
                        </div>
                        <div className="my-4 flex flex-col">
                            <label className='mb-2'>Responsable: </label>
                            <input type="text" 
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
                        <div className="my-4">
                                <input  
                                    type="checkbox"
                                    className="mr-2"
                                    id="completedCheckbox"
                                    name="completedCheckbox"
                                    onChange={this.onChangeTodoCompleted}
                                    checked={this.state.todo_completed}
                                    value={this.state.todo_completed}
                                />
                                <label htmlFor="completedCheckbox" className='text-xl font-bold'>Completada</label>
                            </div>
                            <div className="mt-4">
                            <button type="submit" className='bg-blue-500 rounded-md p-2 font-medium text-gray-200 w-width-full text-center'>Actualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}