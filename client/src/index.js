import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

if ( navigator.serviceWorker ) {
  navigator.serviceWorker.register('/sw.js')
}


// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/sw.js')
//         .then(registration => {
//           console.log('Service Worker registrado con éxito:', registration);
//         })
//         .catch(err => {
//           console.log('Registro de Service Worker fallido:', err);
//         });
//     });
//   }
  
