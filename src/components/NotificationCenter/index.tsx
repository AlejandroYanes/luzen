import { useEffect, useRef } from 'react';

import { registerSW, subscribeToSWMessages } from 'utils/web-push';
import CustomNotificationCenter from './CustomNotificationCenter';

const NotificationCenter = () => {
  const registrationStarted = useRef<boolean>(false);

  useEffect(() => {
    if (!registrationStarted.current) {
      registrationStarted.current = true;
      registerSW();
    }
  }, []);

  useEffect(() => {
    return subscribeToSWMessages((data) => {
      console.log('SW notification', data);
    });
  }, []);

  return (
    <CustomNotificationCenter />
  );
};

export default NotificationCenter;
