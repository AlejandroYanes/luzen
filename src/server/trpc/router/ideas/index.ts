import { router } from 'server/trpc/trpc';
import listAndSearch from './list-and-search';
import post from './post';
import toggleVote from './toggle-vote';
import checkIfUserVoted from './check-if-user-voted';
import listMyIdeas from './list-my-ideas';
import fetchDraft from './fetch-draft';
import listPaginated from './list-paginated';
import toggleStatus from './toggle-status';
import listInfinite from './list-infinite';

export const ideasRouter = router({
  listAndSearch,
  listMyIdeas,
  listPaginated,
  listInfinite,
  fetchDraft,
  toggleVote,
  toggleStatus,
  checkIfUserVoted,
  post,
});
