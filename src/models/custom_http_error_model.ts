export class CustomHttpErrorModel extends Error {
  status: number = 500;
  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}
