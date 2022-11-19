import { NovuProvider, } from '@novu/notification-center';
import { useSession } from 'next-auth/react';

import { clientEnv } from 'env/schema.mjs';
import CustomNotificationCenter from './CustomNotificationCenter';

const NotificationCenter = () => {
  const { data } = useSession();

  return (
    <NovuProvider
      subscriberId={data?.user?.id}
      applicationIdentifier={clientEnv.NEXT_PUBLIC_NOVU_APP_ID as string}
    >
      <CustomNotificationCenter />
    </NovuProvider>
  );
};

export default NotificationCenter;
