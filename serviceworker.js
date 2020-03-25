importScripts('./localforage.js')

const cacheName = 'v1';

const cacheAssets = [
    './index.html',
    './index.css',
    './main.js',
    './localforage.js'
]

// self.addEventListener('fetch', (e) => {
//     e.respondWith(
//         caches.match(e.request).then((r) => {
//             //console.log('[Service Worker] Fetching resource: '+e.request.url);
//         return r || fetch(e.request).then((response) => {
//                   return caches.open(cacheName).then((cache) => {
//             console.log('[Service Worker] Caching new resource: '+e.request.url);
//             cache.put(e.request, response.clone());
//             return response;
//           });
//         });
//       })
//     );
//   });

// Call Install Event
self.addEventListener('install', async (e) => {
    console.log('Service Worker: Installed')
    // Storing data into cache
    const cache = await caches.open(cacheName)
    cache.addAll(cacheAssets)
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated')
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing Old Cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
        .catch(err => console.error(err))
    )
});

// Call Fetch Event
self.addEventListener('fetch', async (e) => {
    console.log('Service Worker: Fetching')
    // CacheFirstThenNetwork
    const req = e.request
    const url = new URL(req.url)
    if(url.origin === location.origin){
        // Get data from cache
        console.log('Cache first', cacheFirst(req))
        e.respondWith(cacheFirst(req))
    } else {
        // Get data from network
        console.log('Netwerk first')
        e.respondWith(networkFirst(req))
    }
});

const cacheFirst = async (req) => {
    // const cacheResponse = await caches.match(req)
    // return cacheResponse || fetch(req)
    const cacheResponse = caches.match(req).then((r) => {
            console.log('[Service Worker] Fetching resource: '+req.url);
            return r || fetch(req).then((response) => {
                    return caches.open(cacheName).then((cache) => {
                console.log('[Service Worker] Caching new resource: '+req.url);
                cache.put(req, response.clone());
                return response;
            });
        });
    })
  return cacheResponse
}


const networkFirst = async (req) => {
    try {
        const res = await fetch(req)
        const data = await res.clone().json()
        localforage.setItem('data', data)
        return res
    } catch (err) {
        console.error('Fetching data failed: ' + err)
        const storage = await localeforage.getItem('data')
        return new Response(storage)
    }
}
