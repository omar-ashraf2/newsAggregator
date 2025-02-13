import { toast } from "@/hooks/use-toast";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
});

export const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const err = result.error as FetchBaseQueryError;

    // Extract API error message if available
    const apiMessage =
      typeof err.data === "object" && err.data !== null && "message" in err.data
        ? (err.data as { message?: string }).message
        : null;

    let friendlyMessage = "An unexpected error occurred. Please try again.";

    switch (err.status) {
      case 400:
        friendlyMessage = apiMessage || "Bad request. Please check your input.";
        break;
      case 401:
        friendlyMessage = apiMessage || "Unauthorized. Please log in.";
        break;
      case 403:
        friendlyMessage =
          apiMessage || "Daily limit reached for this free plan.";
        break;
      case 404:
        friendlyMessage = apiMessage || "Resource not found.";
        break;
      case 408:
        friendlyMessage = apiMessage || "Request timeout. Try again later.";
        break;
      case 429:
        friendlyMessage =
          apiMessage ||
          "Too many requests. You have exceeded the request limit.";
        break;
      case 500:
        friendlyMessage = apiMessage || "Server error. Try again later.";
        break;
      default:
        friendlyMessage = apiMessage || friendlyMessage;
        break;
    }

    toast({
      title: "Error",
      description: friendlyMessage,
      variant: "destructive",
    });

    return {
      error: {
        status: err.status,
        data: {
          message: friendlyMessage,
        },
      } as FetchBaseQueryError,
    };
  }

  return result;
};
