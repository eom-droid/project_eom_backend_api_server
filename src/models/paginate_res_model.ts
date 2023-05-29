export class Meta {
  count: number;
  hasMore: boolean;

  constructor({ count, hasMore }: { count: number; hasMore: boolean }) {
    this.count = count;
    this.hasMore = hasMore;
  }
}

export class PaginateReturnModel<T> {
  meta: Meta;
  data: T[];

  constructor({ meta, data }: { meta: Meta; data: T[] }) {
    this.meta = meta;
    this.data = data;
  }
}
