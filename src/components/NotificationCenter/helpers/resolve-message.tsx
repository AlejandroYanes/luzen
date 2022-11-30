import type { ReactNode } from 'react';
import { Text } from '@mantine/core';

import { NOTIFICATION_TYPES } from 'constants/notifications';
import { formatDate } from 'utils/dates';

type Notification = {
  id: string;
  type: number;
  sentOn: Date;
  idea: { title: string };
  creator: { name: string | null } | null;
};

export default function resolveMessage(
  notification: Notification,
): { title: ReactNode; message: ReactNode } {
  switch (notification.type) {
    case NOTIFICATION_TYPES.NEW_COMMENT:
      return {
        title: 'Your idea got a new comment!',
        message: (
          <>
            <Text>{notification.idea.title}</Text>
            <Text color="dimmed" size="xs">{formatDate(notification.sentOn, 'en')}</Text>
          </>
        ),
      };
    case NOTIFICATION_TYPES.NEW_VOTE:
      return {
        title: 'Your idea got a new vote!',
        message: (
          <>
            <Text>{notification.idea?.title}</Text>
            <Text color="dimmed" size="xs">{formatDate(notification.sentOn, 'en')}</Text>
          </>
        ),
      };
    case NOTIFICATION_TYPES.IDEA_PUBLISHED:
      return {
        title: 'Your idea just got published!',
        message: (
          <>
            <Text>{notification.idea?.title}</Text>
            <Text color="dimmed" size="xs">{formatDate(notification.sentOn, 'en')}</Text>
          </>
        ),
      };
    default:
      return { title: '', message: '' };
  }
}
