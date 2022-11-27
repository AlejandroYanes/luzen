import { Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';

import { env } from 'env/client.mjs';

export function showPushPermissionModal(onConfirm: () => void) {
  openConfirmModal({
    title: 'Notifications',
    labels: { confirm: 'Yes, I want notifications', cancel: "No, I don't want" },
    children: (
      <>
        <Text>
          Would you like to receive notifications related to your idea,
          like new votes, new comments...?
        </Text>
        <Text size="sm" mt="sm">
          Note: <br />
          We use browser notifications to deliver on time updates. But for
          them to work you need to allow notifications on your browser.
          If you accept this we will raise the {"browser's"} prompt for you to give us permission.
        </Text>
      </>
    ),
    onConfirm,
  });
}

let registration: ServiceWorkerRegistration;

export async function registerSW() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    // Push isn't supported on this browser, disable or hide UI.
    return;
  }
  try {
    registration = await navigator.serviceWorker.register('/service-worker.js');
  } catch (err) {
    console.error('Unable to register service worker.', err);
  }
}

export function askPermission(): Promise<NotificationPermission> {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  });
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | undefined> {
  try {
    if (!registration) return;

    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(env.NEXT_PUBLIC_PUSH_KEY!),
    };
    return await registration.pushManager.subscribe(subscribeOptions);
  } catch (err) {
    console.error('Unable to subscribe to push notifications.', err);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function subscribeToSWMessages(listener: (data: string) => void) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // Service-Worker/Push isn't supported on this browser, disable or hide UI.
    console.log('could not register to SW messages');
    return;
  }

  const handleSWMessage =  (event: any) => {
    listener(event.data);
  }

  navigator.serviceWorker.addEventListener('message', handleSWMessage);
  return () => {
    navigator.serviceWorker.removeEventListener('message', handleSWMessage);
  };
}
