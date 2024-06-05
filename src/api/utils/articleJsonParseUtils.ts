import { CustomAPIError } from "../errors/CustomAPIError";
import { ImageOrTextArticle } from "../models/articleModels";

export const articleJsonParseUtils = (
  stringArray: string
): ImageOrTextArticle[] => {
  try {
    const parsed: ImageOrTextArticle[] = JSON.parse(
      stringArray
    ) as ImageOrTextArticle[];
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "object" && item !== null)
    ) {
      return parsed;
    } else {
      throw new CustomAPIError(
        "texts data must be a string representing an array of JSON objects.",
        400
      );
    }
  } catch (error) {
    throw new CustomAPIError(
      "texts data must be a string representing an array of JSON objects.",
      400
    );
  }
};
