import React, { Component } from 'react'
import Image from '../img/img_login'
import logo from '../img/icono192x192.png';
import { Link, useNavigate } from 'react-router-dom';

// Wrapper para usar useNavigate en un componente de clase
function LoginWrapper(props) {
  const navigate = useNavigate();
  return <Login navigate={navigate} {...props} />;
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        correo_electronico: '',
        contrasena: ''
    };

    // Vincula los métodos al contexto de la clase
    this.onChangeCorreoElectronico = this.onChangeCorreoElectronico.bind(this);
    this.onChangeContrasena = this.onChangeContrasena.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // Define los métodos como funciones de la clase
  onChangeCorreoElectronico(e) {
    this.setState({ correo_electronico: e.target.value });
  }

  onChangeContrasena(e) {
    this.setState({ contrasena: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      correo_electronico: this.state.correo_electronico,
      contrasena: this.state.contrasena
    };

    const urlServer = process.env.REACT_APP_URL_SERVER; 
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    fetch(`${backendUrl}/todos/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Revisa la respuesta completa en la consola
      if (data.usuario && data.usuario._id) {  // Asegura que `data.usuario.id` esté presente
        localStorage.setItem('userId', data.usuario._id);
        this.props.navigate(`/${data.usuario._id}`);
      } else {
        alert('Error: Usuario o contraseña incorrectos');
      }
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
      <div className='grid lg:grid-cols-2 grid-cols-1 min-h-screen bg-custom-background'>
        <div className='lg:p-12 md:p-8 p-0 flex items-center justify-center'>
          <div className='bg-custom-conponents lg:rounded-xl md:rounded-xl rounded-none p-6 w-width-full lg:w-width-full lg:h-auto md:w-width-full md:h-auto h-screen'>
            <h3 className='text-center text-white font-semibold text-4xl my-12'>Inicia Sesión</h3>
            <form className='text-gray-200 text-xl' onSubmit={this.onSubmit}>
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
                <button type="submit" className='bg-blue-500 rounded-md p-2 font-semibold text-gray-200 w-width-full text-center'>Iniciar Sesión</button>
              </div>
            </form>
            <div className='flex lg:text-xl md:text-xl text-lg text-white text-center justify-center mt-2'>
              <p>¿No tienes una cuenta?<Link to={'/register'} className='ml-2 text-blue-500 font-semibold'>Regístrate</Link></p>
            </div>
          </div>
        </div>
        <div className='p-6 lg:flex flex-col justify-center items-center bg-white hidden'>
          <div className='flex items-center mb-12'>
            <img src={logo} alt='logo' className='h-16 mr-4'/>
            <h3 className='text-5xl font-bold'>ToDoX</h3>
          </div>
          <Image className='object-contain'/>
        </div>
      </div>
    );
  }
}

export default LoginWrapper;