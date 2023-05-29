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
  after?: _After;

  constructor({
    count,
    category,
    after,
  }: {
    count?: number;
    category?: string;
    after?: any;
  }) {
    try {
      if (
        after !== undefined &&
        after.postDT !== undefined &&
        after.postDateInd !== undefined
      ) {
        this.after = new _After(after);
      } else {
        this.after = undefined;
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

    if (this.after !== undefined) {
      query.postDT = {
        $lte: this.after.postDT,
      };
      query.postDateInd = {
        $lt: this.after.postDateInd,
      };
    }

    return query;
  }
}
