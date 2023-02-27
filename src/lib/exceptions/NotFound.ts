import BaseCustomException from "./base";

export default class NotFoundException extends BaseCustomException {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}
