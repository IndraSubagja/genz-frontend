const simplifyCartData = (cart) =>
  JSON.stringify(
    cart?.map((item) => ({
      qty: item.qty,
      product: item.product.id,
    }))
  );

export const compareCartData = (x, y) => simplifyCartData(x) === simplifyCartData(y);
