import { StarEmptyIcon, StarHalfIcon, StarIcon } from './icons';

export default function Star({ rate, point }) {
  return rate >= point ? <StarIcon /> : rate >= point - 0.5 ? <StarHalfIcon /> : <StarEmptyIcon />;
}
