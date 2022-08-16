import secureLinks from '../secure/links';
import miscLinks from '../misc/links';
import perksLinks from '../perks/links';

const links = {
  secure: secureLinks,
  misc: miscLinks,
  perks: perksLinks,
};

function getDefaultPath(currentAppState, history) {
  const { location: { pathname } } = history;
  return [links.secure.admin.path, links.secure.superSettings.path].includes(pathname) && !currentAppState.isSuperuser
    ? links.secure.access.path
    : links.misc.game.path;
}

export default links;
export { getDefaultPath };
