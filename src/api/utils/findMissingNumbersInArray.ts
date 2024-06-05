export const findMissingNumbersInArray = (
  arr: number[]
): { missingPosition: number[]; maxNumber: number; count: number } => {
  arr.sort((a, b) => a - b);
  const maxNumber = arr[arr.length - 1];
  const fullRange = Array.from({ length: maxNumber }, (_, index) => index + 1);
  const missingNumbers = fullRange.filter((num) => !arr.includes(num));

  return {
    missingPosition: missingNumbers,
    maxNumber: maxNumber,
    count: missingNumbers.length,
  };
};
