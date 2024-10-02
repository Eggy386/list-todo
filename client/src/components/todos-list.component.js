import React , { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Todo = props => (
    <tr>
        <td className = { props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_description}</td>
        <td className = { props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_responsible}</td>
        <td className = { props.todo.todo_completed ? 'completed' : ''}>{props.todo.todo_priority}</td>
        <td>
            <Link to={"/edit/" + props.todo._id}>Editar</Link>
        </td>
    </tr>
)


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
            <div>
                <h3>Tareas</h3>
                <table className="table table-striped" style={{ marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Responsable</th>
                            <th>Prioridad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}
