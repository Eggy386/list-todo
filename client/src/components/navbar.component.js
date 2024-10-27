import React, { Component } from 'react'
import logo from '../img/icono192x192.png';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavbarOpen: false // Estado para controlar si el menú está desplegado
    };
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavbarOpen: !prevState.isNavbarOpen // Alterna el estado
    }));
  };
  render() {
    const userId = localStorage.getItem('userId')
    return (
        <div className='w-width-full mb-4 mx-auto bg-custom-background'>
        <nav className='flex flex-row w-width-full items-center justify-between py-2 px-4'>
          <Link to='/'>
            <img src={logo} className='size-10' alt='logo' />
          </Link>
          <Link to='/' className='text-4xl font-semibold text-gray-200'>
            ToDoX
          </Link>
          <button
            type='button'
            onClick={this.toggleNavbar} // Llama a la función toggleNavbar cuando se hace clic
            aria-controls='myNavbar'
            aria-expanded={this.state.isNavbarOpen}
            aria-label='Toggle navigation'
            className='text-xl focus:outline-none text-gray-200'
          >
            &#9776; {/* Icono de menú estilo hamburguesa */}
          </button>
          <div
            id='myNavbar'
            className={`flex-col absolute right-0 top-14 p-4 mr-4 bg-custom-conponents shadow-lg rounded-lg ${
              this.state.isNavbarOpen ? 'block' : 'hidden'
            }`} // Mostrar u ocultar el menú basado en el estado
          >
            <ul className='flex flex-col text-gray-200'>
              <li>
                <Link to={`/${userId}`}>Tareas</Link>
              </li>
              <li>
                <Link to={`/${userId}/create`}>Crear Tarea</Link>
              </li>
            </ul>
          </div>
        </nav>
        </div>
    )
  }
}
