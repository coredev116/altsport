import { MAX_PROBABILITY, MIN_PROBABILITY } from "../constants/system";

export const getDecimalOdds = (count: number, total: number): number => {
  try {
    if (count <= 0) return 0;

    const probability = count > 0 ? count / total : 0;
    const probabilityPercentage = probability * 100;
    const odds = (1 / probabilityPercentage) * 100;

    return +odds.toFixed(4) || 0;
  } catch (error) {
    throw error;
  }
};

export const getProbability = (count: number, total: number): number => {
  try {
    if (count <= 0) return 0;

    const probability = count > 0 ? count / total : 0;
    const probabilityPercentage = probability * 100;

    return +probabilityPercentage.toFixed(4) || 0;
  } catch (error) {
    throw error;
  }
};

export const getDecimalOddsFromProbability = (probability: number): number => {
  try {
    if (probability <= 0) return 0;

    const odds = (1 / probability) * 100;

    return +odds.toFixed(4) || 0;
  } catch (error) {
    throw error;
  }
};

export const computeProbability = (
  probability: number,
  holdPercentage: number,
  defaultHoldPercentage: number,
): number =>
  holdPercentage === defaultHoldPercentage
    ? +probability
    : getNewProbability(probability, holdPercentage, defaultHoldPercentage);

export const getNewProbability = (
  probability: number,
  holdPercentage: number,
  defaultHoldPercentage: number,
): number => {
  const calculatedHoldPercentage = holdPercentage / defaultHoldPercentage;
  const newProbability = probability * calculatedHoldPercentage;

  if (probability > MAX_PROBABILITY || newProbability > MAX_PROBABILITY) return MAX_PROBABILITY;
  if (probability < MIN_PROBABILITY || newProbability < MIN_PROBABILITY) return MIN_PROBABILITY;

  return +newProbability.toFixed(4) || 0;
};
