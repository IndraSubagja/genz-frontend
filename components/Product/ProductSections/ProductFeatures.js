export default function ProductFeatures({ product, className }) {
  return (
    <ul className={className}>
      {!product.features.length ? (
        <p className="empty">There&apos;s no feature available for this product.</p>
      ) : (
        product.features.map((feature) => <li key={feature.id}>{feature.value}</li>)
      )}
    </ul>
  );
}
