import { Consultant } from "@prisma/client";

export type RegisterConsultantRequest = {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  profession: string;
  photoProfileUrl: string;
  alumnus: string;
  strNumber: string;
  workPlace: string;
};

export type LoginConsultantRequest = {
  username: string;
  password: string;
};

export type ChangePasswordConsultantRequest = {
  password: string;
  newPassword: string;
};

export type ConsultantResponse = {
  id: number;
  username: string;
  name?: string;
  email?: string;
  profession?: string;
  photoProfileUrl?: string;
  alumnus?: string | null;
  strNumber?: string;
  workPlace?: string | null;
  token?: string | null;
};

export function toConsultantResponse(
  consultant: Consultant
): ConsultantResponse {
  return {
    id: consultant.id,
    username: consultant.username,
  };
}

export function toGetConsultantResponse(
  consultant: Consultant
): ConsultantResponse {
  return {
    id: consultant.id,
    username: consultant.username,
    name: consultant.name,
    email: consultant.email,
    profession: consultant.profession,
    photoProfileUrl: consultant.photoProfileUrl,
    alumnus: consultant.alumnus,
    strNumber: consultant.strNumber,
    workPlace: consultant.workPlace,
  };
}

export type WhereObjectGetConsultant = {
  alumnus?:
    | string
    | {
        contains: string;
      };
  profession?:
    | string
    | {
        contains: string;
      };
  workPlace?:
    | string
    | {
        contains: string;
      };
};

export type FilterGetConsultant = {
  alumnus?: string;
  profession?: string;
  workPlace?: string;
  name?: string;
};
