import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

import { env } from 'env/client.mjs';
import { WEB_PUSH_STATUS } from 'constants/web-push';
import { trpc } from 'utils/trpc';
import CustomNotificationCenter from './CustomNotificationCenter';

const NotificationCenter = () => {
  const { data, status } = useSession();
  const { mutate } = trpc.users.updateWebPushConf.useMutation();
  const registrationStarted = useRef<boolean>(false);
  const registrationRef = useRef<ServiceWorkerRegistration | undefined>(undefined);

  const subscribeToPushNotifications = async () => {
    try {
      if (!registrationRef.current) return;
      const registration = registrationRef.current;

      const result = await askPermission();
      if (result !== 'granted') return;

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(env.NEXT_PUBLIC_PUSH_KEY!),
      };
      const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);
      await mutate({
        status: WEB_PUSH_STATUS.GRANTED,
        data: JSON.stringify(pushSubscription),
      });

    } catch (err) {
      console.error('Unable to register service worker.', err);
    }
  };

  const registerSW = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      // Push isn't supported on this browser, disable or hide UI.
      return;
    }
    try {
      const registration =  await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered');
      registrationRef.current = registration;
      navigator.serviceWorker.addEventListener('message', function (event) {
        console.log('Received a message from service worker: ', event.data);
      });
    } catch (err) {
      console.error('Unable to register service worker.', err);
    }
  };

  const askPermission = () => {
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    });
  }

  const urlBase64ToUint8Array = (base64String: string) => {
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

  useEffect(() => {
    if (!registrationStarted.current) {
      registrationStarted.current = true;
      registerSW();
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && data?.user?.webPushStatus === undefined) {
      subscribeToPushNotifications();
    }
  }, [data, status]);

  return (
    <CustomNotificationCenter />
  );
};

export default NotificationCenter;
