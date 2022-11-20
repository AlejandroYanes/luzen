import { Skeleton, Group } from '@mantine/core';

export default function GroupSkeleton() {
  return (
    <>
      <Skeleton height={24} width={220} />
      <Group align="center" position="apart" pl="md">
        <Skeleton height={24} width={80} />
        <Skeleton height={24} width={60} />
      </Group>
      <Group align="center" position="apart" pl="md">
        <Skeleton height={24} width={80} />
        <Skeleton height={24} width={60} />
      </Group>
    </>
  );
}
