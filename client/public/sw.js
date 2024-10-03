self.addEventListener('install', event => {
    //Crear un caché
    caches.open('appShell5').then(cache => {
        cache.addAll([
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
        ]);
    });

    
    self.skipWaiting();
})

self.addEventListener('activate', event=>{
     // Eliminar la caché viejita
     caches.delete('appShell4')
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
                    return caches.match('/img_error.jpg');
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
                return caches.match('/img_error.jpg');
            }
        });
    });

    event.respondWith(resp);
});