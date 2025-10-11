export default function formatDisplayCurrency(price: number, currency = 'USD') {
  const config: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency || 'USD',
  };

  let locale: string;

  switch (currency) {
    case 'USD':
      locale = 'en-US';
      break;
    default:
      locale = 'en-US';
  }

  return price !== undefined
    ? new Intl.NumberFormat(locale, config).format(price)
    : '-';
}
