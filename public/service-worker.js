function isClientFocused() {
  return clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let focusedClient = undefined;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          focusedClient = windowClient;
          break;
        }
      }

      return focusedClient;
    });
}

self.addEventListener('push', function(event) {
  console.log('SW - This push event has data: ', event.data.text());
  const parsedBody = JSON.parse(event.data.text());
  const promiseChain = isClientFocused().then((focusedClient) => {
    if (focusedClient) {
      console.log("SW - Don't need to show a notification.");
      focusedClient.postMessage({
        message: 'Received a push message.',
        time: new Date().toString(),
      });
      return;
    }

    return self.registration.showNotification(parsedBody.title, {
      data: {
        link: parsedBody.link,
      },
      body: parsedBody.body,
      sound: '/b2.mp3',
    });
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  console.log('SW - clicked notification: ', clickedNotification);
  const urlToOpen = new URL(clickedNotification.data.link, self.location.origin).href;
  const promiseChain = clients.openWindow(urlToOpen);
  event.waitUntil(promiseChain);
});
