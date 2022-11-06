import { router } from 'server/trpc/trpc';
import listTop from './list-top';
import post from './post';
import toggleVote from './toggle-vote';
import checkIfUserVoted from './check-if-user-voted';
import listComments from './list-comments';
import postComment from './post-comment';
import listMyIdeasByStatus from './list-my-ideas-by-status';
import fetchDraft from './fetch-draft';


export const ideasRouter = router({
  listTop,
  post,
  toggleVote,
  checkIfUserVoted,
  listComments,
  postComment,
  listMyIdeasByStatus,
  fetchDraft,
});
