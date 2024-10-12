import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(reg => {
          console.log('Service Worker registrado:', reg);
      }).catch(err => console.error('Error al registrar el Service Worker:', err));
  });
}

 
