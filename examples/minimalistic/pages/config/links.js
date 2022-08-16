import neutralLinks from '../neutral/links';
import redLinks from '../red/links';
import greenLinks from '../green/links';

const links = {
  neutral: neutralLinks,
  red: redLinks,
  green: greenLinks,
};

function getDefaultPath(currentAppState) {
  return currentAppState.likesRed ? links.red.theRed.path : links.neutral.home.path;
}

export default links;
export { getDefaultPath };
