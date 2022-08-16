import { AppRouting } from 'smart-react-routing';
import Wrapper, { WrapperProps } from './Wrapper';
import { getDefaultPath } from './links';
import useCurrentAppState, { AppState } from '../../appState';

const appRouting = new AppRouting<AppState, WrapperProps>(useCurrentAppState, { getDefaultPath, Wrapper });

export default appRouting;
