import BaseCustomException from "./base";

export default class ClientException extends BaseCustomException {
  constructor(message: string, code: number = 400) {
    super(message);
    this.name = "ClientException";
    this.code = code;
  }
}
