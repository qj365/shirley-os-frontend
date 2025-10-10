export const fillArrayWithNumber = (
  number: number,
  startWith?: number
): number[] => {
  return Array(number)
    .fill(null)
    .map((_, index) => (startWith ? startWith + index : index));
};
