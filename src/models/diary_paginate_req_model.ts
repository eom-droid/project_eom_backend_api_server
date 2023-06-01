import { PAGINATE_COUNT_DEFAULT, PAGINATE_LIMIT } from "../constant/default";
import { CustomHttpErrorModel } from "./custom_http_error_model";

class _After {
  postDT: Date;
  postDateInd: number;

  constructor({ postDT, postDateInd }: { postDT: Date; postDateInd: number }) {
    this.postDT = postDT;
    this.postDateInd = postDateInd;
  }
}

export class DiaryPaginateReqModel {
  count: number;
  category?: string;
  postDT?: Date;
  postDateInd?: number;

  constructor({
    count,
    category,
    postDT,
    postDateInd,
  }: {
    count?: number;
    category?: string;
    postDT?: Date;
    postDateInd?: number;
  }) {
    try {
      if (postDT !== undefined && postDateInd !== undefined) {
        this.postDT = postDT;
        this.postDateInd = postDateInd;
      }

      this.count = count ?? PAGINATE_COUNT_DEFAULT;
      this.category = category;
      return this;
    } catch (e) {
      throw new CustomHttpErrorModel({
        status: 400,
        message: "잘못된 요청입니다.",
      });
    }
  }

  generateQuery() {
    const query: any = {};

    if (this.category !== undefined) {
      query.category = this.category;
    }

    if (this.postDT && this.postDateInd) {
      query.postDT = {
        $lte: this.postDT,
      };
      query.postDateInd = {
        $lt: this.postDateInd,
      };
    }

    return query;
  }
}
