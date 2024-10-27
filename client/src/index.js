import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App/>
    </Router>
  </React.StrictMode>
  
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service Worker registrado:', reg);
        if(Notification.permission==='default'){
          Notification.requestPermission(permiso => {
              if (permiso === 'granted') {
                  reg.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey:"BF0R56KJLXyBC-WUGXWLFyuZmRhcCMn41E_rEGALwDugm0wN6PfIuCo2PzzlaDwvgvgTy_uheK-TDZ-llHWJ7dY"
                  })
                  .then(resp=>resp.toJSON())
                  .then(resp => {
                    console.log('Subscription:', resp);
                    
                    // Envía la suscripción a tu servidor
                    fetch('http://localhost:4000/todos/suscription/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(resp)
                    })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Error en la solicitud: ' + response.statusText);
                      }
                      return response.json();
                    })
                    .then(data => {
                        console.log('Suscripción guardada en la BD:', data);
                    })
                    .catch(error => {
                      console.log(error)
                        console.error('Error al enviar la suscripción:', error);
                    });
                });
              } else {
                  console.log("El usuario no registró")
              }
          });
      }
      }).catch(err => console.error('Error al registrar el Service Worker:', err));
  });
}

 
