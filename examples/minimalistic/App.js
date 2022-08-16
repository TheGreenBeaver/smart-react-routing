import { Link } from 'react-router-dom';
import Pages from './pages';
import links from './pages/config/links';
import { useAppStateLogic } from './appState';

function App() {
  const { appState, setAppState } = useAppStateLogic();

  return (
    <main>
      <section>
        <div>
          <label htmlFor='green'>
            I like green
          </label>
          <input
            id='green'
            type='checkbox'
            checked={appState.likesGreen}
            onChange={e => setAppState(curr => ({ ...curr, likesGreen: e.target.checked }))}
          />

          <label htmlFor='red'>
            I like red
          </label>
          <input
            id='red'
            type='checkbox'
            checked={appState.likesRed}
            onChange={e => setAppState(curr => ({ ...curr, likesRed: e.target.checked }))}
          />
        </div>
        <div style={{ display: 'flex', columnGap: 16 }}>
          <Link to={links.neutral.home.path}>Home</Link>
          <Link to={links.green.theGreen.path}>Green</Link>
          <Link to={links.red.theRed.path}>Red</Link>
        </div>
      </section>
      <Pages />
    </main>
  );
}

export default App;
