import { Group, Pagination, TextInput } from '@mantine/core';

import { calculateTotal } from 'utils/pagiantion';
import useMobileView from 'hooks/ui/useMobileView';
import StackView from './StackView';
import TableView from './TableView';

export interface Props {
  page: number;
  count: number;
  data: {
    id: string;
    postedAt: Date;
    content: string;
    author: {
      name: string | null;
      image: string | null;
    } | null;
  }[];
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

const CommentsTable = (props: Props) => {
  const { page, count, data, onQueryChange, onPageChange } = props;
  const isMobileScreen = useMobileView();
  const View = isMobileScreen ? StackView : TableView;

  return (
    <>
      <TextInput
        my="lg"
        mr="auto"
        defaultValue=""
        placeholder="Search comments"
        sx={{ width: isMobileScreen ? '100%' : '280px' }}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <View data={data} />
      <Group position="right" py="lg">
        <Pagination
          page={page}
          onChange={onPageChange}
          total={calculateTotal(count)}
        />
      </Group>
    </>
  );
}

export default CommentsTable;
