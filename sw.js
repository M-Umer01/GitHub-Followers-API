/*jshint unused:false*/
/*jshint strict:false*/
/*globals caches, Promise*/
var cacheName = 'v0.0.2';
var filesToCache = [
	'/',
	'index.html',
	'css/style.css',
	'js/script.js',
	'favicon.ico',
	'images/default-user.png',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName) {
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	if(new URL(e.request.url).origin === location.origin){
		e.respondWith(
			caches.match(e.request).then(function(response) {
				return response || fetch(e.request);
			})
		);
	} else {
		e.respondWith(
			caches.open(cacheName).then(function(cache) {
				return cache.match(e.request).then(function(response){
					if(response){
						return response;
					}
					else{
						return fetch(e.request).then(function(response){
							if(response.type!="opaque"){
								cache.put(e.request, response.clone());
							}
							return response;
						}).catch(function(err){
							if(e.request.url.indexOf("avatars") !== -1)
								return cache.match('images/default-user.png');
							else
								return cache.match(e.request);
						});
					}
				})
			})
		);
	}
});