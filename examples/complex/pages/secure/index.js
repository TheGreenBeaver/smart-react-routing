import Access from './Access';
import SuperSettings from './SuperSettings';
import Admin from './Admin';
import appRouting from '../config/appRouting';
import links from './links';
import { AppRouting } from 'smart-react-routing';

const routes = [
  appRouting.createAppRoute(links.access, Access, {
    hits: AppRouting.ANY, misses: AppRouting.ANY, isSuperuser: AppRouting.ANY,
  }, { wrapperProps: { isImportant: true } }),
  appRouting.createAppRoute(links.superSettings, SuperSettings, {
    hits: AppRouting.ANY, misses: AppRouting.ANY, isSuperuser: true,
  }, { wrapperProps: { isImportant: true } }),
  appRouting.createAppRoute(links.admin, Admin, {
    hits: AppRouting.ANY, misses: AppRouting.ANY, isSuperuser: true,
  }, { wrapperProps: { isImportant: true } }),
];

export default routes;
