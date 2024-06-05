import { ZodType, z } from "zod";

export class ArticleValidation {
  static readonly CREATE: ZodType = z.object({
    title: z
      .string()
      .min(1, {
        message: "Title is required and should be at least 1 character long.",
      })
      .max(50, { message: "Title should not exceed 50 characters." }),
    thumbnail: z.custom(
      (value) =>
        typeof value === "object" && value !== null && "filename" in value,
      { message: "Thumbnail is required and should be a file object." }
    ),
    textArticle: z.string().refine(
      (value) => {
        try {
          const parsed = JSON.parse(value);
          return (
            Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                item.position !== null &&
                item.position !== undefined &&
                typeof item.position === "number" &&
                Number.isInteger(item.position) &&
                item.text !== null &&
                item.text !== undefined &&
                typeof item.text === "string"
            )
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "textArticle must be a string representing an array of JSON objects.",
      }
    ),
  });

  static readonly EDIT: ZodType = z.object({
    articleId: z.number().int(),
    title: z
      .string()
      .min(1, {
        message: "Title is required and should be at least 1 character long.",
      })
      .max(50, { message: "Title should not exceed 50 characters." }),
    thumbnail: z.custom(
      (value) =>
        typeof value === "object" && value !== null && "filename" in value,
      { message: "Thumbnail is required and should be a file object." }
    ),
    textArticle: z.string().refine(
      (value) => {
        try {
          const parsed = JSON.parse(value);
          return (
            Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                typeof item.id === "number" &&
                Number.isInteger(item.id) &&
                item.position !== null &&
                item.position !== undefined &&
                typeof item.position === "number" &&
                Number.isInteger(item.position) &&
                item.text !== null &&
                item.text !== undefined &&
                typeof item.text === "string"
            )
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "textArticle must be a string representing an array of JSON objects with 'position' (integer) and 'text' (string) properties.",
      }
    ),
    imageArticle: z.union([
      z.string().refine(
        (value) => {
          try {
            const parsed = JSON.parse(value);
            return (
              Array.isArray(parsed) &&
              parsed.every(
                (item) =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof item.id === "number" &&
                  Number.isInteger(item.id) &&
                  item.position !== null &&
                  item.position !== undefined &&
                  typeof item.position === "number" &&
                  Number.isInteger(item.position) &&
                  item.url !== null &&
                  item.url !== undefined &&
                  typeof item.url === "string"
              )
            );
          } catch {
            return false;
          }
        },
        {
          message:
            "imageArticle must be a string representing an array of JSON objects with 'position' (integer) and 'url' (string) properties.",
        }
      ),
      z.undefined(),
      z.null(),
    ]),
  });
}

//   imageArticle: z.string().refine(
//       (value) => {
//         try {
//           const parsed = JSON.parse(value);
//           return (
//             Array.isArray(parsed) &&
//             parsed.every((item) => typeof item === "object" && item !== null)
//           );
//         } catch {
//           return false;
//         }
//       },
//       {
//         message:
//           "imageArticle must be a string representing an array of JSON objects.",
//       }
//     ),
