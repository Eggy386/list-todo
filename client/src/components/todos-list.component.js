import React , { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-500'; // Rojo para alta prioridad
      case 'Media':
        return 'bg-yellow-500'; // Amarillo para media prioridad
      case 'Baja':
        return 'bg-green-600'; // Verde para baja prioridad
      default:
        return 'bg-gray-500'; // Gris por defecto
    }
};

const Todo = (props) => (
    <div className="bg-custom-conponents shadow-md rounded-lg p-6 mb-4 border border-gray-500">
      <h3 className="text-2xl font-semibold text-gray-200">{props.todo.todo_description}</h3>
      <div className="mt-4 flex justify-between">
        <p className="text-gray-500">{props.todo.todo_completed === true ? 'Completado' : 'En Progreso'}</p>
        <span className={`px-3 py-1 rounded-full text-white text-sm ${getPriorityColor(props.todo.todo_priority)}`}>
          {props.todo.todo_priority}
        </span>
      </div>
      <div className="items-center mt-4 text-gray-800">
        <p className='text-gray-500'>Responsable</p>
        <p className='text-gray-200 text-xl font-medium'>{props.todo.todo_responsible}</p>
      </div>
      <div className="flex items-center mt-4 w-width-full justify-between">
          <button className='bg-custom-conponents border-2 border-blue-500 rounded-md p-2 font-medium text-blue-500 w-[45%]'>Eliminar</button>
          <Link to={"/edit/" + props.todo._id} className='bg-blue-500 rounded-md p-2 font-medium text-gray-200 w-[45%] text-center'>Editar</Link>
      </div>
    </div>
  );


export default class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: []
        };
    }

    componentDidMount() {
        this.loadTodos();
    }

    // Evitar que las consultas se hagan de forma continua en cada actualización
    loadTodos() {
        axios.get('http://localhost:4000/todos')
            .then( res => {
                this.setState({
                    todos: res.data
                })
            })
            .catch( err => console.log(err));
    }

    todoList = () => this.state.todos.map(
        (todo, index) => <Todo todo={todo} key={index} />
    )
    

    render() {
        return (
            <div className="w-width-full bg-custom-background p-4">
                <h3 className="text-3xl font-bold mb-4 text-gray-200">Tareas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {this.todoList()}
                </div>
            </div>
        )
    }
}
