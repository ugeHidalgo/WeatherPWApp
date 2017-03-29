var cacheName = 'weatherPWA-v3';
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/localforage-1.4.0.js',
  '/styles/ud811.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

//This will fire during the install processs-> best place to cache app shell required resources.
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});


//This will fire after the activate event-> best place to clean cache for not used files.
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    //Obtiene todos los key list de la cache e itera sobre cada uno de ellos, y si hay algún cambio ...
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});


//Aquí se interceptan todos los networks request y se devuelve el requested resource desde la cache.
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
      //Response viene de la caché y en caso de no tenerla se pide con fetch a la network
    })
  );
/*caches.match(event.request) allows us to match each resource requested from the network with the equivalent 
  resource available in the cache, if there is a matching one available. The matching is done via url and vary 
  headers, just like with normal HTTP requests.
  fetch(e.request); sirve para que en el caso en el que el recurso no está en la cache, se busque a traves de la red.
  */


});
