import SinglePrize from './SinglePrize';
import PrizeList from './PrizeList';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.singlePrize, SinglePrize, { hits: 5, misses: 4, isSuperuser: AppRouting.ANY }),
  appRouting.createAppRoute(links.prizeList, PrizeList, { hits: 5, misses: 4, isSuperuser: AppRouting.ANY }),
];

export default routes;
