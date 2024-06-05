import { CustomRequest } from "../middlewares/auth";

export interface ArticleMulterRequest extends CustomRequest {
  files?:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[];
}
