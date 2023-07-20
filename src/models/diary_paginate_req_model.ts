import { PAGINATE_COUNT_DEFAULT } from "../constant/default";
import { CustomHttpErrorModel } from "./custom_http_error_model";

export class DiaryPaginateReqModel {
  count: number;
  category?: string;
  postDT?: Date;

  constructor({
    count,
    category,
    postDT,
  }: {
    count?: number;
    category?: string;
    postDT?: Date;
  }) {
    try {
      this.count = count ?? PAGINATE_COUNT_DEFAULT;
      this.postDT = postDT;
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

    if (this.postDT !== undefined) {
      query.postDT = {
        $lte: this.postDT,
      };
    }
    return query;
  }
}
