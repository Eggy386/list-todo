import React, { Component } from 'react'
import Image from '../img/img_login'
import logo from '../img/icono192x192.png';
import { Link } from 'react-router-dom';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      correo_electronico: '',
      contrasena: ''
    };

    // Vincula los métodos al contexto de la clase
    this.onChangeNombre = this.onChangeNombre.bind(this);
    this.onChangeCorreoElectronico = this.onChangeCorreoElectronico.bind(this);
    this.onChangeContrasena = this.onChangeContrasena.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Define los métodos como funciones de la clase
  onChangeNombre(e) {
    this.setState({ nombre: e.target.value });
  }
  onChangeCorreoElectronico(e) {
    this.setState({ correo_electronico: e.target.value });
  }

  onChangeContrasena(e) {
    this.setState({ contrasena: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      nombre: this.state.nombre,
      correo_electronico: this.state.correo_electronico,
      contrasena: this.state.contrasena
    };

    const urlServer = process.env.REACT_APP_URL_SERVER;
    fetch(`${urlServer}/todos/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(data => {
      console.log('Usuario creado');
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
      this.saveTodoToIndexedDB(user)
      .then(() => {
        console.log('Tarea guardada en IndexedDB debido a la falla en la red');
      })
      .catch(err => console.error('Error al guardar en IndexedDB:', err));
    });

    this.setState({
        correo_electronico: '',
        contrasena: ''
    });
  }

  saveTodoToIndexedDB(todo) {
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
        console.log('Datos almacenados en la IndexedDB')
      };

      addRequest.onerror = () => {
        console.log('Error al guardar en IndexedDB');
      };
    };

    dbRequest.onerror = () => {
      console.log('Error al abrir IndexedDB');
    };
  }
  render() {
    return (
      <div className='grid g:grid-cols-2 grid-cols-1 min-h-screen bg-custom-background'>
        <div className='p-6 lg:flex flex-col justify-center items-center bg-white hidden'>
          <div className='flex items-center mb-12'>
            <img src={logo} alt='logo' className='h-16 mr-4'/>
            <h3 className='text-5xl font-bold'>ToDoX</h3>
          </div>
          <Image className='object-contain'/>
        </div>
        <div className='lg:p-8 md:p-8 p-0flex items-center justify-center'>
          <div className='bg-custom-conponents lg:rounded-xl md:rounded-xl rounded-none p-6 w-width-full lg:size-auto md:size-auto h-screen'>
            <h3 className='text-center text-white font-semibold text-4xl my-12'>Regístro</h3>
            <form className='text-gray-200 text-xl' onSubmit={this.onSubmit}>
              <div className="my-8 flex flex-col">
                <label className='mb-2'>Nombre</label>
                <input
                  type="text"
                  className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                  placeholder='Ingrese su nombre'
                  onChange={this.onChangeNombre}
                  value={this.state.nombre}
                  />
              </div>
              <div className="my-8 flex flex-col">
                <label className='mb-2'>Correo</label>
                <input
                  type="email"
                  className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                  placeholder='Ingrese su correo electrónico'
                  onChange={this.onChangeCorreoElectronico}
                  value={this.state.correo_electronico}
                  />
              </div>
              <div className="my-8 flex flex-col">
                <label className='mb-2'>Contraseña</label>
                <input
                  type="password"
                  className="bg-custom-conponents rounded-md border border-gray-500 p-1"
                  placeholder='Ingrese su contraseña'
                  onChange={this.onChangeContrasena}
                  value={this.state.contrasena}
                />
              </div>
              <div className="my-8">
                <button type="submit" className='bg-blue-500 rounded-md p-2 font-semibold text-gray-200 w-width-full text-center'>Registrarse</button>
              </div>
            </form>
            <div className='flex lg:text-xl md:text-xl text-lg text-white text-center justify-center mt-2'>
              <p>¿Ya tienes una cuenta?<Link to={'/'} className='ml-2 text-blue-500 font-semibold'>Inicia sesión</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
