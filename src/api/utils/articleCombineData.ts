import { ImageOrTextArticle } from "../models/articleModels";

export const articleCombineData = (
  array1: ImageOrTextArticle[],
  array2: ImageOrTextArticle[]
) => {
  const combinedArray = array1.concat(array2);
  const sortedArray = combinedArray.sort((a, b) => a.position - b.position);
  return sortedArray;
};
