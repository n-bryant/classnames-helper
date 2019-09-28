import uniqueClassnames from "./uniqueClassnames";

describe("uniqueClassnames", () => {
  it("should return unique names", () => {
    expect(uniqueClassnames("foo", { foo: true })).toEqual(["foo"]);
    expect(uniqueClassnames(["foo", "foo"])).toEqual(["foo"]);
    expect(uniqueClassnames("foo foo")).toEqual(["foo"]);
  });

  it("should filter out falsy conditionals", () => {
    expect(uniqueClassnames("foo", { bar: false })).toEqual(["foo"]);
  });

  it("should handle nulls, empty conditionals, etc", () => {
    expect(uniqueClassnames({}, null)).toEqual([]);
  });
});
