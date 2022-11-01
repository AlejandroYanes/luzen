import { Skeleton } from '@mantine/core';

const Loading = () => {
  return (
    <div>
      <Skeleton height={18} width={40} mt={99} mb={4} />
      <Skeleton height={36} mb={28} />
      <Skeleton height={18} width={40} mb={4} />
      <Skeleton height={14} width={40} mb={4} />
      <Skeleton height={196} mb={28} />
      <Skeleton height={18} width={40} mb={4} />
      <Skeleton height={462} mb={24} />
      <Skeleton height={36} mt={40} />
    </div>
  );
};

export default Loading;
