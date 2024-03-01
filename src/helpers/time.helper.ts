export const formatMMSSToSeconds = (lapTimeInMMSS: string) => {
  const arr = lapTimeInMMSS.split(":");
  const seconds = arr.length > 1 ? +arr[0] * 60 + +arr[1] : 0;
  return +seconds.toFixed(3);
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
