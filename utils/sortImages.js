export default function sortImages(product) {
  product.images.sort((a, b) => a.name.localeCompare(b.name));
}
