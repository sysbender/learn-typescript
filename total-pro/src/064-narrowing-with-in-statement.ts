import { it } from "vitest";

type APIResponse = { data: { id: string } } | { error: string };

const handleResponse = (response: APIResponse) => {
  // property in object
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};

it("should handle a response with data", () => {
  const response = {
    data: {
      id: "123",
    },
  };
});
