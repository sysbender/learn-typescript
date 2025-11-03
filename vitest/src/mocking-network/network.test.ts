import { test, expect, vi } from "vitest";

export async function getPostBody(id: number) {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts/1").then(
    (r) => r.json()
  );
  return data.body;
}

vi.stubGlobal("fetch", async () => {
  return {
    json() {
      return {
        body: "foo",
      };
    },
  };
});

test("should fetch", async () => {
  const result = await getPostBody(1);

  expect(result).toMatchInlineSnapshot(`"foo"`);
});

// use msw package to mock network other than just fetch
