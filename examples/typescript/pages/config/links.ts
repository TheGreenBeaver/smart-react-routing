import neutralLinks from '../neutral/links';
import redLinks from '../red/links';
import greenLinks from '../green/links';
import { AppState } from '../../appState';

const links = {
  neutral: neutralLinks,
  red: redLinks,
  green: greenLinks,
};

function getDefaultPath(currentAppState: AppState): string {
  return currentAppState.likesGreen ? links.green.theGreen.path : links.neutral.home.path;
}

export default links;
export { getDefaultPath };
