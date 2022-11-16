import type { MantineTheme} from '@mantine/core';
import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export const mobileViewMediaQuery = (theme: MantineTheme) => (
  `(max-width: ${theme.breakpoints.xs}px)`
);

export default function useMobileView() {
  const theme = useMantineTheme();
  return useMediaQuery(mobileViewMediaQuery(theme));
}
