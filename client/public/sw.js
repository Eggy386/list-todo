

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-todos') {
        event.waitUntil(
            sendTodosFromIndexedDB() // Sincronizar las tareas cuando haya conexión
        );
    }
});

function sendTodosFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open('database');

        dbRequest.onsuccess = event => {
            const db = event.target.result;
            const transaction = db.transaction('todos', 'readonly');
            const objectStore = transaction.objectStore('todos');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = () => {
                const todos = getAllRequest.result;

                if (todos.length === 0) {
                    console.log('No hay tareas para sincronizar.');
                    return resolve();
                }

                // Enviar cada tarea al backend
                const promises = todos.map(todo => {
                    return fetch('http://localhost:4000/todos/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(todo)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la API');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Tarea sincronizada con éxito:', data);
                        eliminarTodoById(todo.id); // Eliminar tarea de IndexedDB tras sincronizar
                    })
                    .catch(error => {
                        console.error('Error al sincronizar tarea:', error);
                    });
                });

                Promise.all(promises).then(() => resolve()).catch(reject);
            };

            getAllRequest.onerror = event => {
                console.error('Error al obtener tareas de IndexedDB:', event);
                reject();
            };
        };

        dbRequest.onerror = event => {
            console.error('Error al abrir la base de datos:', event);
            reject();
        };
    });
}

// Función para eliminar una tarea de IndexedDB
function eliminarTodoById(id) {
    let dbRequest = indexedDB.open('database');

    dbRequest.onsuccess = event => {
        let db = event.target.result;
        let transaction = db.transaction('todos', 'readwrite');
        let objectStore = transaction.objectStore('todos');
        
        let deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => {
            console.log(`Tarea con ID ${id} eliminada de IndexedDB.`);
        };

        deleteRequest.onerror = event => {
            console.error('Error al eliminar tarea de IndexedDB:', event);
        };
    };
}


const APP_SHELL_CACHE = 'appShell'; //Nombre de la caché principal
const DYNAMIC_CACHE = 'dynamic'; // Nombre de la caché dinamica
// Array de las rutas de los archivos esenciales
const APP_SHELL = [
    '/index.html',
    '/manifest.json',
    '/icon/icon32x32.png',
    '/icon/icon48x48.png',
    '/icon/icon64x64.png',
    '/icon/icon128x128.png',
    '/icon/icon192x192.png',
    '/icon/icon256x256.png',
    '/icon/icon512x512.png',
    '/icon/icon1024x1024.png',
    '/static/media/logo.ee7cd8ed.svg',
    '/img_error.jpg'
];

// Instalación del Service Worker y cacheo de archivos principales (app shell)
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(APP_SHELL_CACHE).then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(APP_SHELL);
      })
    );
});

// Activación del SW y limpieza de cachés
self.addEventListener('activate', (event) => {
    // Obtiene los nombres de las cachés almacenadas
    caches.keys().then((keys) =>
        keys
            .filter((key) => key !== APP_SHELL_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key)) // Borra los cachpes que no sean los actuales
    )
});

// Intercepta peticiones de red
self.addEventListener('fetch', event => {
    const resp = fetch(event.request).then(respuesta => {
        if (!respuesta) {
            // Si la respuesta no existe, buscamos en el cache
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    // Si no está en el cache, retornamos una imagen de error desde el cache
                    return caches.match('/public/img/img_error.jpg');
                }
            });
        } else {
            // Si la respuesta existe, la almacenamos en el cache dinámico
            return caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(event.request.url, respuesta.clone());
                return respuesta;
            });
        }
    }).catch(err => {
        // Si ocurre un error (por ejemplo, si no hay conexión), buscamos en el cache
        return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            } else {
                // Si no está en el cache, retornamos la imagen de error
                return caches.match('/public/img/img_error.jpg');
            }
        });
    });

    event.respondWith(resp);
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
    console.log('Sync event triggered', event);
    // Si el tag del evento es 'sync-users', se llama a la función sendUserDataFromIndexedDB(), 
    //que intenta sincronizar los datos de usuarios almacenados en IndexedDB con un servidor remoto.
    if (event.tag === 'sync-users') {
        sendTodosFromIndexedDB();
    }
});

// Función para sincronizar datos de IndexedDB
function sendTodosFromIndexedDB() {
    const dbRequest = indexedDB.open('database');

    dbRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction('todos', 'readonly');
        const objectStore = transaction.objectStore('todos');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
            const todos = getAllRequest.result;

            if (todos.length === 0) {
                console.log('No hay tareas para sincronizar.');
            }

            // Enviar cada tarea al backend
            const promises = todos.map(todo => {
                return fetch('http://localhost:4000/todos/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(todo)
                })
                .then(response => {
                    if (!response.ok) {
                        console.log('Error en la API');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Tarea sincronizada con éxito:', data);
                    //eliminarTodosLosUsuarios(); // Eliminar tarea de IndexedDB tras sincronizar
                    eliminarTodoById(todo.id)
                })
                .catch(error => {
                    console.error('Error al sincronizar tarea:', error);
                });
            });
        };

        getAllRequest.onerror = event => {
            console.error('Error al obtener tareas de IndexedDB:', event);
        };
    };

    dbRequest.onerror = event => {
        console.error('Error al abrir la base de datos:', event);
    };
}

function eliminarRegistroIndexedDB(id) {
    const request = indexedDB.open('database');

    request.onerror = (event) => {
        console.error('Error abriendo la base de datos', event);
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('todos', 'readwrite');
        const objectStore = transaction.objectStore('todos');
        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => {
            console.log(`Registro con id ${id} eliminado`);
        };
    };
}

