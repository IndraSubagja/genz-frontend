export default function Stock({ product }) {
  return product.isAvailable ? <h4 className="success">Ready</h4> : <h4 className="danger">Out of Stock</h4>;
}
