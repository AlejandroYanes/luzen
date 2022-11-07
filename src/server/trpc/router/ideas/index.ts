import { router } from 'server/trpc/trpc';
import listAndSearch from './list-and-search';
import post from './post';
import toggleVote from './toggle-vote';
import checkIfUserVoted from './check-if-user-voted';
import listComments from './list-comments';
import postComment from './post-comment';
import listMyIdeasByStatus from './list-my-ideas-by-status';
import fetchDraft from './fetch-draft';


export const ideasRouter = router({
  listAndSearch,
  post,
  toggleVote,
  checkIfUserVoted,
  listComments,
  postComment,
  listMyIdeasByStatus,
  fetchDraft,
});
