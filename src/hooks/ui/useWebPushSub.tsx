import { Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { openConfirmModal } from '@mantine/modals';

import { trpc } from 'utils/trpc';
import {
  askPermission,
  subscribeToPushNotifications
} from 'utils/web-push';

export default function useWebPushSub(onSuccess?: () => void) {
  const { mutate: storeWebPushSub } = trpc.users.storeWebPushSub.useMutation({
    onSuccess: () => {
      if (onSuccess) onSuccess();

      showNotification({
        title: 'Done',
        message: (
          <div>
            <Text>
              {"You're"} now set to receive notifications.
            </Text>
            <Text>
              You can disable notifications at any time on the Settings page.
            </Text>
          </div>
        ),
      });
    },
  });

  const setupPushNotifications = () => {
    openConfirmModal({
      title: 'Notifications',
      labels: { confirm: 'Yes, I want notifications', cancel: "No, I don't want" },
      children: (
        <>
          <Text>
            Would you like to receive notifications related to your ideas,
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
      onConfirm: async () => {
        const permission = await askPermission();
        if (permission === 'granted') {
          const subscription = await subscribeToPushNotifications();
          storeWebPushSub({ data: JSON.stringify(subscription) });
        }
      },
    });
  }

  return { setupPushNotifications };
}
