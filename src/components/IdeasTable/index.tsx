import { Group, Pagination, TextInput, } from '@mantine/core';

import { calculateTotal } from 'utils/pagiantion';
import type { inferOppositeExcludingType } from 'utils/prop-types';
import useMobileView from 'hooks/ui/useMobileView';
import TableView from './TableView';
import StackView from './StackView';

interface CommonProps {
  page: number;
  count: number;
  data: {
    id: string;
    title: string;
    postedAt: Date;
    votes: number;
    isDraft: boolean;
    author: {
      name: string | null;
      image: string | null;
    } | null;
    _count: {
      comments: number;
    };
  }[];
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

interface UserProps {
  isForUsers: true;
}

interface AdminProps {
  isForAdmins: true;
  onToggleStatus: (ideaId: string) => void;
}

export type Props = CommonProps & inferOppositeExcludingType<UserProps, AdminProps>;

const IdeasTable = (props: Props) => {
  const {
    page,
    count,
    data,
    isForAdmins,
    onToggleStatus,
    onPageChange,
    onQueryChange,
  } = props;
  const isMobileScreen = useMobileView();
  const View = isMobileScreen ? StackView : TableView;

  return (
    <>
      <TextInput
        my="lg"
        mr="auto"
        defaultValue=""
        placeholder="Search ideas"
        sx={{ width: isMobileScreen ? '100%' :'280px' }}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <View data={data} isForAdmins={!!isForAdmins} onToggleStatus={onToggleStatus} />
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

export default IdeasTable;
