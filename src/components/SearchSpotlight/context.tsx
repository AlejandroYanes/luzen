import type { ReactNode} from 'react';
import { createContext, useContext } from 'react';

interface Props {
  loadMore: () => void;
  children: ReactNode;
}

const context = createContext<Props['loadMore']>(() => undefined);
const { Provider } = context;

export default function InfiniteLoadProvider(props: Props) {
  const { loadMore, children } = props;
  return (
    <Provider value={loadMore}>{children}</Provider>
  );
}

export const useLoadMoreAction = () => useContext(context);
