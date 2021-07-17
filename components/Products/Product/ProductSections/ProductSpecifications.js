export default function ProductSpecifications({ product, className }) {
  return (
    <ul className={className}>
      {!product.specifications.length ? (
        <p className="empty">There&apos;s no specification available for this product.</p>
      ) : (
        product.specifications.map((specification) => (
          <li key={specification.id}>
            <strong>{specification.key}</strong>: {specification.value}
          </li>
        ))
      )}
    </ul>
  );
}
