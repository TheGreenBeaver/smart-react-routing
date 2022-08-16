import { useState } from 'react';
import { appStateStore } from '../../../appState';
import { Link } from 'react-router-dom';
import links from '../../config/links';

function Game() {
  const [goodButton, setGoodButton] = useState(() => Math.round(Math.random()));

  function handleClick(id) {
    if (id === goodButton) {
      appStateStore.hits++;
    } else {
      appStateStore.misses++;
    }
    setGoodButton(Math.round(Math.random()));
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button onClick={() => handleClick(0)}>
          Click Me
        </button>
        <button onClick={() => handleClick(1)}>
          Click Me
        </button>
      </div>

      <button
        onClick={() => {
          appStateStore.hits = 0;
          appStateStore.misses = 0;
        }}
      >
        Restart
      </button>

      <h1>
        Click the buttons and win prizes
      </h1>
      <Link to={links.perks.prizeList.path}>
        View prizes (if you have 5 or more hits and 4 or less misses)
      </Link>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Link to={links.secure.superSettings.path}>
          Super Settings
        </Link>
        <Link to={links.secure.admin.path}>
          Admin
        </Link>
      </div>
    </div>
  );
}

export default Game;
