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
    ? new Intl.NumberFormat(locale, config).format(price)
    : '-';
}
