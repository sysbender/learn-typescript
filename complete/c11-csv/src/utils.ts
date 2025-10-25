export const dateStringToDate = (dataString: string): Date => {
  const dateParts = dataString.split("/").map((value: string) => {
    return parseInt(value);
  });
  return new Date(dateParts[2]!, dateParts[1]! - 1, dateParts[0]!);
};
