import { buildResponse } from "@/common/lib/ResponseBuilder";

describe("buildResponse", () => {
  it("builds a response from passed optionsb", () => {
    type MyFoo = { someKey: string; anotherKey: number };

    const options = {
      success: true,
      data: { someKey: "abc", anotherKey: 123 },
    };

    const result = buildResponse<MyFoo>(options);

    expect(result).toMatchObject({
      success: true,
      error: undefined,
      data: { someKey: "abc", anotherKey: 123 },
    });
  });
});
