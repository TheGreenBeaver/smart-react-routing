import prizesData from '../prizes.data';
import { Link, useHistory } from 'react-router-dom';
import links from '../../config/links';
import { useMemo, useRef } from 'react';
import { parse } from 'query-string';

function PrizeList() {
  const history = useHistory();
  const { location: { search } } = history;
  const q = useMemo(() => parse(search)?.q ?? '', [search]);
  const inputRef = useRef(null);

  return (
    <>
      <Link to={links.misc.game.path}>Back to Game</Link>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <input ref={inputRef} defaultValue={q} />
        <button onClick={() => history.push(links.perks.prizeList.compose({ q: inputRef.current.value }))}>
          Search for prizes
        </button>
      </div>
      <ul style={{ marginTop: 8 }}>
        {prizesData.filter(prize => prize.title.includes(q)).map(prize => (
          <li key={prize.id}>
            <Link to={links.perks.singlePrize.compose(prize.id)}>
              {prize.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PrizeList;
