/* eslint-disable max-len */
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';
import { useColorScheme } from '@mantine/hooks';
import { useRouter } from 'next/router';

import { env as clientEnv } from 'env/client.mjs';

const theme = {
  common: {
    fontFamily: 'Roboto, serif'
  },
};

const NotificationCenter = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  function onNotificationClick(notification: any) {
    router.push(notification.cta.data.url);
  }

  return (
    <NovuProvider
      subscriberId={clientEnv.NEXT_PUBLIC_NOVU_SUBSCRIBER}
      applicationIdentifier={'uZLoM_7nUfGh'}
    >
      <PopoverNotificationCenter
        theme={theme}
        colorScheme={colorScheme}
        onNotificationClick={onNotificationClick}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

export default NotificationCenter;
