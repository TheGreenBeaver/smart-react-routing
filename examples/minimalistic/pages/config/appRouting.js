import { AppRouting } from 'smart-react-routing';
import Wrapper from './Wrapper';
import { getDefaultPath } from './links';
import useCurrentAppState from '../../appState';

const appRouting = new AppRouting(useCurrentAppState, { getDefaultPath, Wrapper });

export default appRouting;
