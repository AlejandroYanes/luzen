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
  const parsedBody = JSON.parse(event.data.text());
  const promiseChain = isClientFocused().then((focusedClient) => {
    if (focusedClient) {
      focusedClient.postMessage(parsedBody);
      return;
    }

    return self.registration.showNotification(parsedBody.title, {
      data: {
        link: parsedBody.link,
      },
      body: parsedBody.body,
    });
  });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification;
  const urlToOpen = new URL(clickedNotification.data.link, self.location.origin).href;
  const promiseChain = clients.openWindow(urlToOpen);
  event.waitUntil(promiseChain);
});
