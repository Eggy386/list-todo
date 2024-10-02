self.addEventListener('install', event => {
    //Crear un caché
    caches.open('appShell2').then(cache => {
        cache.addAll([
            '/index.html',
           '/manifest.json'
        ]);
    });

    
    self.skipWaiting();
})

self.addEventListener('activate', event=>{
     // Eliminar la caché viejita
     caches.delete('appShell')
})

//Dinamica
 self.addEventListener('fetch', event => {
    const resp = fetch(event.request).then(respuesta => {
        if (!respuesta) {
            // Si la respuesta no existe, buscamos en el cache
            return caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                } else {
                    // Si no está en el cache, retornamos una imagen de error desde el cache
                    return console.log("Ocurrió un error"); // Ruta de la imagen de error en cache
                }
            });
        } else {
            // Si la respuesta existe, la almacenamos en el cache dinámico
            return caches.open('dinamico').then(cache => {
                cache.put(event.request, respuesta.clone());
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
                return console.log("Ocurrió un error");
            }
        });
    });

    event.respondWith(resp);
});