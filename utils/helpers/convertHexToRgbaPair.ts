const convertHexToRgbaPair = (
  hex: string
): Record<'solid' | 'transparent', string> => {
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/;
  if (!hexColorRegex.test(hex)) {
    throw new Error('Invalid hex color.');
  }
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {
    solid: `rgba(${r}, ${g}, ${b}, 1)`,
    transparent: `rgba(${r}, ${g}, ${b}, 0)`,
  };
};

export default convertHexToRgbaPair;
