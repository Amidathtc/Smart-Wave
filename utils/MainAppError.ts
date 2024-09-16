export class MainAppError extends Error {
  httpcode: number;

  constructor(options: { message: string; httpcode: number }) {
    super(options.message);
    this.httpcode = options.httpcode;
  }
}