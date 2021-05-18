import { useState } from 'react';

import Preview from './ProductImage/Preview';
import Thumbnail from './ProductImage/Thumbnail';

export default function ProductImages({ product }) {
  const [order, setOrder] = useState(0);

  return (
    <>
      <Preview product={product} order={order} />
      {product.images.length > 1 && <Thumbnail product={product} order={order} setOrder={setOrder} />}
    </>
  );
}
