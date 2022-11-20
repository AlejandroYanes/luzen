import { Group, Switch, Text, Title } from '@mantine/core';

interface Props {
  label: string;
  isEmailOn: boolean;
  onEmailToggle: () => void;
  isInAppOn: boolean;
  onInAppToggle: () => void;
}

export default function NotificationGroup(props: Props) {
  const { label, isEmailOn, isInAppOn, onEmailToggle, onInAppToggle } = props;
  return (
    <>
      <Title order={5}>{label}</Title>
      <Group align="center" position="apart" pl="md">
        <Text>Email</Text>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          size="md"
          sx={{ display: 'flex' }}
          checked={isEmailOn}
          onChange={onEmailToggle}
        />
      </Group>
      <Group align="center" position="apart" pl="md">
        <Text>In App</Text>
        <Switch
          onLabel="ON"
          offLabel="OFF"
          size="md"
          sx={{ display: 'flex' }}
          checked={isInAppOn}
          onChange={onInAppToggle}
        />
      </Group>
    </>
  );
}
