import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import CustomLink from '../../../../utils/customLink';

export default function ProductDescription({ product, className }) {
  const content = !product.description ? (
    <p className="empty">There&apos;s no description available for this product.</p>
  ) : (
    unified()
      .use(parse)
      .use(remark2react, {
        remarkReactComponents: {
          // Use CustomLink instead of <a>
          a: CustomLink,
        },
      })
      .processSync(product.description).result
  );

  return <div className={className}>{content}</div>;
}
