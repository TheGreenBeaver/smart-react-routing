import * as PropTypes from 'prop-types';

function Wrapper({ children, currentAppState, isImportant }) {
  let backgroundColor;
  if (currentAppState.hits === currentAppState.misses) {
    backgroundColor = '#64eed5';
  } else {
    backgroundColor = currentAppState.hits > currentAppState.misses ? '#7cee6a' : '#e54d64';
  }

  return (
    <main
      style={{
        maxWidth: 700,
        width: '80vw',
        height: '100vh',
        margin: '0 auto',
        padding: '48px 24px',
        backgroundColor,
        border: isImportant ? '4px solid red' : 'none',
      }}
    >
      <p>Hits: {currentAppState.hits}</p>
      <p>Misses: {currentAppState.misses}</p>
      {children}
    </main>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  currentAppState: PropTypes.shape({ hits: PropTypes.number.isRequired, misses: PropTypes.number.isRequired }),
  isImportant: PropTypes.bool,
};

export default Wrapper;
