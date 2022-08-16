import { appStateStore } from '../../../appState';
import appRouting from '../../config/appRouting';
import { Link } from 'react-router-dom';
import links from '../../config/links';

function Access() {
  const returnToDesiredPage = appRouting.useReturnToDesiredPage();
  return (
    <div>
      <button
        onClick={() => {
          appStateStore.isSuperuser = true;
          returnToDesiredPage();
        }}
        style={{ fontSize: 36, textTransform: 'uppercase', background: 'red', color: 'white', marginBottom: 16 }}
      >
        Confirm you are a superuser
      </button>
      <Link style={{ display: 'block', marginTop: 24 }} to={links.misc.game.path}>
        Start game as a common user
      </Link>
    </div>
  );
}

export default Access;
