import { Article } from "@prisma/client";

export type CreateArticleRequest = {
  title: string;
  textArticle: string;
};

export type ArticleResponse = {
  id: number;
  writer?: string;
  title: string;
  thumbnailUrl: string;
  textsAndImagesData?: object[];
  createdAt?: Date;
};

export type ImageOrTextArticle = {
  id?: number;
  position: number;
  text?: string;
  url?: string;
  alt?: string;
};

export type ArticleImage = {
  position: number;
  url: string;
  alt: string;
};

export function toArticleResponse(article: Article): ArticleResponse {
  return {
    id: article.id,
    title: article.title,
    thumbnailUrl: article.thumbnail,
  };
}
