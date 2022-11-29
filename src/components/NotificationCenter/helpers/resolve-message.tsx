import type { ReactNode } from 'react';
import { Text } from '@mantine/core';

import { NOTIFICATION_TYPES } from 'constants/notifications';
import { formatDate } from 'utils/dates';

type Notification = {
  id: string;
  type: number;
  sentOn: Date;
  idea: { title: string } | null;
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
            <Text>{`There's a new comment for: ${notification.idea?.title}`}</Text>
            <Text size="sm">{formatDate(notification.sentOn, 'en')}</Text>
          </>
        ),
      };
  }
}
