import React, { Component} from 'react';
import { Route, Routes } from 'react-router-dom';
import TodosList from './components/todos-list.component';
import CreateTodo from './components/create-todo.component';
import EditTodo from './components/edit-todo.component';
import './App.css';
import Login from './components/login.component';
import Register from './components/register.component';

class App extends Component {
  render(){
    return (
      <Routes>
          <Route path='/' exact element={<Login/>} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/edit/:id' element={<EditTodo/>} />
          <Route path='/:userId/create' element={<CreateTodo/>} />
          <Route path='/:userId' element={<TodosList/>}/>
      </Routes>
    );
  }
}
export default App;
