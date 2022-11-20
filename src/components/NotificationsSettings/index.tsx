import { ChannelTypeEnum } from '@novu/shared';
import { Divider, Stack, Title } from '@mantine/core';

import type { NotificationTemplate } from 'models/novu';
import { trpc } from 'utils/trpc';
import { NotificationGroup } from './NotificationGroup';
import RenderIf from '../RenderIf';

interface Props {
  showAdminSettings: boolean;
}

export default function NotificationsSettings(props: Props) {
  const { showAdminSettings } = props;

  const { data, refetch } = trpc.novu.fetchPreferences.useQuery();
  const { mutate } = trpc.novu.togglePreferenceStatus.useMutation({
    onSuccess: () => refetch(),
  });

  if (!data) return null;

  const renderGroup = (group: NotificationTemplate) => (
    <NotificationGroup
      key={group.template._id}
      label={group.template.name}
      isEmailOn={group.preference.channels.email}
      onEmailToggle={() => mutate({
        template: group.template._id,
        channel: ChannelTypeEnum.EMAIL,
        enabled: !group.preference.channels.email,
      })}
      isInAppOn={group.preference.channels.in_app}
      onInAppToggle={() => mutate({
        template: group.template._id,
        channel: ChannelTypeEnum.IN_APP,
        enabled: !group.preference.channels.in_app,
      })}
    />
  );

  const elements = data.filter((group) => !group.template.critical).map(renderGroup);

  const criticalElements = showAdminSettings
    ? data.filter((group) => group.template.critical).map(renderGroup)
    : null;

  return (
    <Stack spacing="sm">
      <Title order={3}>Notifications</Title>
      {elements}
      <RenderIf condition={showAdminSettings}>
        <Divider label="For Admins" labelPosition="center" mt="md" />
        {criticalElements}
      </RenderIf>
    </Stack>
  );
}
