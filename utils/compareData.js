const simplifyCartData = (cart) =>
  JSON.stringify(
    cart.map((item) => ({
      qty: item.qty,
      product: item.product.id,
    }))
  );
const simplifyWishlistData = (wishlist) =>
  JSON.stringify(
    wishlist.map((item) => ({
      product: item.product.id,
    }))
  );
const simplifyShippingAddressData = (shippingAddress) =>
  JSON.stringify({
    recipientName: shippingAddress.recipientName,
    addressLine1: shippingAddress.addressLine1,
    addressLine2: shippingAddress.addressLine2,
    city: shippingAddress.city,
    country: shippingAddress.country,
    postalCode: shippingAddress.postalCode,
    phoneNumber: shippingAddress.phoneNumber,
  });

export const compareCartData = (x, y) => simplifyCartData(x) === simplifyCartData(y);
export const compareWishlistData = (x, y) => simplifyWishlistData(x) === simplifyWishlistData(y);
export const compareShippingAddressData = (x, y) => simplifyShippingAddressData(x) === simplifyShippingAddressData(y);
