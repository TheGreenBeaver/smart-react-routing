import { AppLink } from 'smart-react-routing';

const links = {
  singlePrize: new AppLink('/perks/prize/:id'),
  prizeList: new AppLink('/perks/prize_list'),
};

export default links;
