export default function optimizePrice(num) {
  num = num.toFixed(2);

  let realNum = parseInt(num);
  let decNum = num.match(/\.\d*/)[0];

  realNum = realNum
    .toString()
    .split(/(?=(?:\d{3})*$)/)
    .join(',');

  return `$${realNum}${decNum}`;
}
