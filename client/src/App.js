import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import TodosList from './components/todos-list.component';
import CreateTodo from './components/create-todo.component';
import EditTodo from './components/edit-todo.component';
import Login from './components/login.component';
import Register from './components/register.component';
import ProtectedRoute from './components/protectedRoute'; // Componente para proteger rutas

class App extends Component {
  render() {
    // Verifica si el usuario está autenticado
    const userId = localStorage.getItem('userId');

    return (
      <Routes>
        {/* Redirección automática según el estado de autenticación */}
        <Route
          path="/"
          element={userId ? <Navigate to={`/${userId}`} /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route path="/edit/:id" element={<ProtectedRoute><EditTodo /></ProtectedRoute>} />
        <Route path="/:userId/create" element={<ProtectedRoute><CreateTodo /></ProtectedRoute>} />
        <Route path="/:userId" element={<ProtectedRoute><TodosList /></ProtectedRoute>} />
      </Routes>
    );
  }
}

export default App;
