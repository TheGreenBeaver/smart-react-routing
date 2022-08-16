import { proxy, useSnapshot } from 'valtio';

const appStateStore = proxy({ hits: 0, misses: 0, isSuperuser: false });

function useCurrentAppState() {
  return useSnapshot(appStateStore);
}

export { appStateStore };
export default useCurrentAppState;
