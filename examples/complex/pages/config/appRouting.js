import { AppRouting } from 'smart-react-routing';
import Wrapper from './Wrapper';
import { getDefaultPath } from './links';
import useCurrentAppState from '../../appState';

function fits(currentAppState, requiredAppState) {
  const fitsByHits = requiredAppState.hits === AppRouting.ANY || currentAppState.hits >= requiredAppState.hits;
  const fitsByMisses = requiredAppState.misses === AppRouting.ANY || currentAppState.misses <= requiredAppState.misses;
  const fitsBySuperuser = [AppRouting.ANY, currentAppState.isSuperuser].includes(requiredAppState.isSuperuser);
  return fitsByHits && fitsByMisses && fitsBySuperuser;
}

const appRouting = new AppRouting(useCurrentAppState, { getDefaultPath, Wrapper, fits });

export default appRouting;
