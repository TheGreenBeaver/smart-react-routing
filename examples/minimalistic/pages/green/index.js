import TheGreen from './TheGreen';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.theGreen, TheGreen, { likesGreen: true, likesRed: AppRouting.ANY }),
];

export default routes;
