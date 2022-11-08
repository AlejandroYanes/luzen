import { router } from 'server/trpc/trpc';
import listAndSearch from './list-and-search';
import post from './post';
import toggleVote from './toggle-vote';
import checkIfUserVoted from './check-if-user-voted';
import listMyIdeasByStatus from './list-my-ideas-by-status';
import fetchDraft from './fetch-draft';
import listPaginated from './list-paginated';
import toggleStatus from './toggle-status';


export const ideasRouter = router({
  listAndSearch,
  post,
  toggleVote,
  checkIfUserVoted,
  listMyIdeasByStatus,
  fetchDraft,
  listPaginated,
  toggleStatus,
});
