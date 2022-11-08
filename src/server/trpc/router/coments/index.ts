import { router } from 'server/trpc/trpc';
import list from './list';
import listPaginated from './list-paginated';
import postComment from './post-comment';

export const commentsRouter = router({
  list,
  listPaginated,
  postComment,
});
