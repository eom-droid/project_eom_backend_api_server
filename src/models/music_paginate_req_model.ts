import { PAGINATE_COUNT_DEFAULT, PAGINATE_LIMIT } from "../constant/default";
import { CustomHttpErrorModel } from "./custom_http_error_model";

export class MusicPaginateReqModel {
  count: number;
  after?: string;

  constructor({ count, after }: { count?: number; after?: string }) {
    try {
      this.count = count ?? PAGINATE_COUNT_DEFAULT;
      this.after = after;
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

    if (this.after !== undefined) {
      query._id = {
        $lt: this.after,
      };
    }

    return query;
  }
}
