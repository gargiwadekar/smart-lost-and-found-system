import stringSimilarity from "string-similarity";

const normalize = (value = "") =>
  value.toString().toLowerCase().trim().replace(/\s+/g, " ");

export const getTextSimilarity = (lostName = "", foundName = "") => {
  const lost = normalize(lostName);
  const found = normalize(foundName);

  if (!lost || !found) return 0;
  return stringSimilarity.compareTwoStrings(lost, found);
};

export const getImageSimilarity = (lostImage = "", foundImage = "") => {
  if (!lostImage || !foundImage) return 0;

  const lostName = normalize(lostImage.replace(/^\d+-/, ""));
  const foundName = normalize(foundImage.replace(/^\d+-/, ""));

  return stringSimilarity.compareTwoStrings(lostName, foundName);
};

export const buildMatchConfidence = (lostItem, foundItem) => {
  const textScore = getTextSimilarity(lostItem.itemName, foundItem.itemName);
  const imageScore = getImageSimilarity(lostItem.image, foundItem.image);
  const weightedScore = imageScore
    ? textScore * 0.75 + imageScore * 0.25
    : textScore;

  return {
    textScore,
    imageScore,
    confidence: Math.round(weightedScore * 100),
  };
};
