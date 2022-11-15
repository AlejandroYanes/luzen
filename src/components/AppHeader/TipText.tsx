import { Text, Tooltip } from '@mantine/core';

interface Props {
  isLoggedIn: boolean;
  isMobileScreen: boolean;
}

export default function TipText(props: Props) {
  const { isLoggedIn, isMobileScreen } = props;

  if (isLoggedIn || isMobileScreen) return null;

  return (
    <Tooltip
      label="Sign In and start sharing right now."
      color="blue"
      position="bottom"
      offset={20}
      withArrow
    >
      <Text>What to post your ideas?</Text>
    </Tooltip>
  );
}
