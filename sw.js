const CACHE_NAME = 'avaliacao-eventos-cache-v1';
const urlsToCache = [
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request) // Tenta buscar da rede primeiro
      .then(function(response) {
        // Se a requisição for bem-sucedida, armazena a resposta no cache
        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, response.clone()); // Clona a resposta para evitar consumi-la
          });
        return response;
      })
      .catch(function() {
        // Se a requisição falhar, busca no cache
        return caches.match(event.request)
          .then(function(response) {
            return response || Promise.reject('Recurso não encontrado no cache.'); // Rejeita a promessa se não encontrar no cache
          });
      })
  );
});