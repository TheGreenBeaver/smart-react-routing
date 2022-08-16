import { useParams } from 'react-router-dom';
import prizesData from '../prizes.data';

function SinglePrize() {
  const { id } = useParams();
  const thePrize = prizesData.find(prize => prize.id === +id);
  return thePrize
    ? (
      <div>
        <h2>{thePrize.title}</h2>
        <p>{thePrize.description}</p>
      </div>
    ) : (
      <h2>No such prize</h2>
    );
}

export default SinglePrize;
