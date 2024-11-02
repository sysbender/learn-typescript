type APIResponse = { data: { id: string } } | { error: string };

const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};

