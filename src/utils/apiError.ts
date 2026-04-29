import axios from "axios";

type ApiErrorOptions = {
  notFoundMessage?: string;
  defaultMessage?: string;
};

export function getApiErrorMessage(
  error: unknown,
  options: ApiErrorOptions = {},
) {
  const defaultMessage =
    options.defaultMessage ?? "Could not reach the server.";

  if (!axios.isAxiosError(error)) {
    return defaultMessage;
  }

  if (!error.response) {
    return defaultMessage;
  }

  switch (error.response.status) {
    case 403:
      return "You don't have permission to view this.";
    case 404:
      return options.notFoundMessage ?? "Not found";
    case 429:
      return "Too many requests. Please slow down.";
    default:
      if (error.response.status >= 500) {
        return "Something went wrong on our end. Try again later.";
      }

      return defaultMessage;
  }
}
