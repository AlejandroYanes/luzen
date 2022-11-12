import type { ReactNode } from 'react';
import { Button, Group } from '@mantine/core';

import { useLoadMoreAction } from './context';

export default function CustomWrapper({ children }: { children: ReactNode }) {
  const loadMore = useLoadMoreAction();
  return (
    <div
      data-el="search-items-wrapper"
      style={{
        height: 'calc(100% - 50px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: 'calc(100% - 57px)', overflow: 'auto' }}>
        {children}
      </div>
      <Group
        data-el="search-items-wrapper-footer"
        position="center"
        px={15}
        py="xs"
        sx={(theme) => ({
          borderTop: `1px solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
          }`,
        })}
      >
        <Button variant="outline" size="sm" onClick={loadMore}>Load more</Button>
      </Group>
    </div>
  );
}
