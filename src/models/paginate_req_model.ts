import { PAGINATE_COUNT_DEFAULT } from "../constant/default";
import { CustomHttpErrorModel } from "./custom_http_error_model";

class PaginateReqModel {
  count: number;
  after: string | undefined;

  constructor({ count, after }: { count?: number; after?: string }) {
    try {
      this.count = count ?? PAGINATE_COUNT_DEFAULT;
      this.after = after;
      return this;
    } catch (error) {
      console.log(new Date().toISOString() + ": npm log: " + error);

      throw new CustomHttpErrorModel({
        status: 400,
        message: "잘못된 요청입니다.",
      });
    }
  }
}

export class DiaryPaginateReqModel extends PaginateReqModel {
  category: string | undefined;

  constructor({
    count,
    after,
    category,
  }: {
    count?: number;
    after?: string;
    category?: string;
  }) {
    super({ count, after });
    this.category = category;
    return this;
  }

  generateQuery() {
    const query: any = {};

    if (this.category !== undefined) {
      query.category = this.category;
    }
    if (this.after !== undefined) {
      query._id = {
        $lt: this.after,
      };
    }

    return query;
  }
}
