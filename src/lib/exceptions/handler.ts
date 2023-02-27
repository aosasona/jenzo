import BaseCustomException from "./base";

interface UnwrappedException {
  message: string;
  code: number;
}
export default function handleException(e: unknown): UnwrappedException {
  let message = "Something went wrong";
  let code = 500;
  if (e instanceof BaseCustomException) {
    message = e.message;
    code = e.code;
  }
  return {
    message,
    code: code,
  };
}
