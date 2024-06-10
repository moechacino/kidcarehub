import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  ConsultantResponse,
  FilterGetConsultant,
  WhereObjectGetConsultant,
  toConsultantResponse,
  toGetConsultantResponse,
} from "../../models/consultantModel";
import { ConsultantQuery } from "../../query/consultant";

export class GetConsultantService {
  static async getAllConsultant(
    filters: FilterGetConsultant,
    take: number = 4,
    skip: number = 0
  ): Promise<{
    consultants: ConsultantResponse[];
    page: {
      total: number;
      current: number;
    };
  }> {
    const { alumnus, profession, workPlace } = filters;
    const whereObject: WhereObjectGetConsultant = {};
    if (alumnus) whereObject.alumnus = { contains: alumnus };
    if (profession) whereObject.profession = { contains: profession };
    if (workPlace) whereObject.workPlace = { contains: workPlace };

    const consultants: ConsultantResponse[] =
      (await prismaClient.consultant.findMany({
        skip: skip,
        take: take,
        where: whereObject,
        select: ConsultantQuery.select(),
      })) as ConsultantResponse[];

    const totalConsultant = await prismaClient.consultant.count({
      where: whereObject,
    });

    const totalPage: number = Math.ceil(totalConsultant / take);
    const currentPage: number = skip / take + 1;

    return {
      consultants: consultants,
      page: {
        total: totalPage,
        current: currentPage,
      },
    };
  }

  static async getOneConsultant(
    consultantId: number
  ): Promise<ConsultantResponse> {
    const consultant = await prismaClient.consultant.findUnique({
      where: { id: consultantId },
    });

    if (!consultant) {
      throw new NotFoundError(
        `consultant with id ${consultantId} is not found`
      );
    }

    return toGetConsultantResponse(consultant);
  }
}
