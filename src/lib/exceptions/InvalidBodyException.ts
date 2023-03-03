import BaseCustomException from "./base";

export default class InvalidBodyException extends BaseCustomException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBodyException";
  }
}
