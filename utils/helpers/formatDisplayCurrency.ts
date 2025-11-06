export function roundTo(n: number, digits = 2) {
  const multi = 10 ** digits;
  const num = Number.parseFloat((n * multi).toFixed(11));
  return (Math.sign(num) * Math.round(Math.abs(num))) / multi;
}

export default function formatDisplayCurrency(price: number, currency = 'GBP') {
  const config: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency || 'GBP',
  };

  let locale: string;

  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    case 'GBP':
      locale = 'en-GB';
      break;
    default:
      locale = 'en-GB';
  }

  return price !== undefined
    ? new Intl.NumberFormat(locale, config).format(roundTo(price || 0, 2))
    : '-';
}
