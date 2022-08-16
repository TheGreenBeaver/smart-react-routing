import TheRed from './TheRed';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.theRed, TheRed, { likesGreen: AppRouting.ANY, likesRed: true }),
];

export default routes;
