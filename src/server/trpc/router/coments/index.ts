import { router } from 'server/trpc/trpc';
import listInfinite from './list-infinite';
import listPaginated from './list-paginated';
import postComment from './post-comment';
import listCommentsForMyIdeas from './list-comments-for-my-idea';

export const commentsRouter = router({
  listInfinite,
  listPaginated,
  listCommentsForMyIdeas,
  postComment,
});
