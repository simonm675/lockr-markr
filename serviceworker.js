const assets = ["/", "savedlocker/", "settings/"];
const cacheTypes = ["main", "font", "image"];
const cacheVersion = "_v4";

self.addEventListener("install", (event) => {
  // waitUntil - keeps the SW in the installing state to do something before the event is completed.
  event.waitUntil(
    // Access to the cache API in the browser in order to save complete requests including response.
    caches.open(cacheTypes[0] + cacheVersion).then((cache) => {
      // Adds all assets to the cache
      return cache.addAll(assets);
    })
    //.then(self.skipWaiting())
  );
});

function putInCache(request, response) {
  //console.log(request, response);
  let cacheKey = cacheTypes.includes(request.destination)
    ? request.destination
    : "main";
  caches.open(cacheKey + cacheVersion).then((cache) => {
    cache.put(request, response);
  });
}

async function cacheFirst(request) {
  let responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  let responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
}

async function networkFirst(request) {
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
  }
}

self.addEventListener("fetch", (event) => {
  //console.log(event.request);
  let response = "";
  switch (event.request.destination) {
    case "font":
      response = cacheFirst(event.request);
      break;
    case "image":
      response = cacheFirst(event.request);
      break;
    default:
      response = cacheFirst(event.request);
  }
  event.respondWith(response);
});

// Activate SW
async function deleteOldCaches() {
  // Which caches should be maintained
  let cacheKeepList = [];
  cacheTypes.forEach((element) => {
    cacheKeepList.push(element + cacheVersion);
  });

  // All caches are detected and filtered
  let keyList = await caches.keys();
  let cacheToDelete = keyList.filter((key) => !cacheKeepList.includes(key));

  // Deleting the caches that are no longer needed
  return Promise.all(
    cacheToDelete.map((key) => {
      return caches.delete(key);
    })
  );
}

self.addEventListener("activate", (event) => {
  console.log("service worker activated");
  event.waitUntil(
    deleteOldCaches().then(() => {
      // So that all clients (tabs in the browser) use the activated service worker - otherwise only after reloading the page again.
      clients.claim();
    })
  );
});
