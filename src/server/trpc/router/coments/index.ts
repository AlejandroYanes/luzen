import { router } from 'server/trpc/trpc';
import list from './list';
import listPaginated from './list-paginated';
import postComment from './post-comment';
import listCommentsForMyIdeas from './list-comments-for-my-idea';

export const commentsRouter = router({
  list,
  listPaginated,
  listCommentsForMyIdeas,
  postComment,
});
