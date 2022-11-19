import { IconSearch } from '@tabler/icons';
import { Button, Code, ActionIcon } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';

interface Props {
  isHomePage: boolean;
  isMobileScreen: boolean;
}

export default function SearchButton(props: Props) {
  const { isHomePage, isMobileScreen } = props;

  if (isHomePage) return null;

  if (isMobileScreen) {
    return (
      <ActionIcon onClick={() => openSpotlight()}>
        <IconSearch size={24} />
      </ActionIcon>
    );
  }

  return (
    <Button
      variant="default"
      leftIcon={<IconSearch size={16} stroke={1.5} />}
      rightIcon={isMobileScreen ? null : <Code>⌘ + K</Code>}
      onClick={() => openSpotlight()}
    >
      {isMobileScreen ? '' : 'Search'}
    </Button>
  );
}
