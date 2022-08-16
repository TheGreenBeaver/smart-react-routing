import { FC, PropsWithChildren } from 'react';
import { AppState } from '../../appState';

export type WrapperProps = PropsWithChildren<{
  currentAppState: AppState
}>;

const Wrapper: FC<WrapperProps> = ({ children }) => <>{children}</>;

export default Wrapper;
