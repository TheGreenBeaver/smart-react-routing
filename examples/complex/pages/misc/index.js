import Game from './Game';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.game, Game, { hits: AppRouting.ANY, misses: AppRouting.ANY, isSuperuser: AppRouting.ANY }),
];

export default routes;
