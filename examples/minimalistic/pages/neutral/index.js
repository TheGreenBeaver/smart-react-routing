import Home from './Home';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.home, Home, { likesGreen: AppRouting.ANY, likesRed: AppRouting.ANY }),
];

export default routes;
