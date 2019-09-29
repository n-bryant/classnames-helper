import getBEMModifierClassnames from "./getBEMModifierClassnames";
import BEM from "bem-helper-js";
import classnamesHelper from "classnames";

const classNamesAsArray = names => classnamesHelper(names).split(" ");

const countClassnames = namesArray =>
  namesArray.reduce(
    (counts, name) => ({
      ...counts,
      [name]: (counts[name] || 0) + 1
    }),
    {}
  );

const hasRedundantNames = namesArray =>
  Object.values(countClassnames(namesArray)).filter(count => count > 1).length >
  0;

describe("test helpers", () => {
  describe("hasRedundantNames", () => {
    it("should count redundant class names", () => {
      expect(hasRedundantNames(["foo", "foo", "bar"])).toBe(true);
      expect(hasRedundantNames(["foo", "bar"])).toBe(false);
      expect(hasRedundantNames([])).toBe(false);
    });
  });
  describe("countClassnames", () => {
    it("should count class names", () => {
      expect(countClassnames(["foo", "foo", "bar"])).toEqual({
        foo: 2,
        bar: 1
      });
      expect(countClassnames(["foo", "bar"])).toEqual({
        foo: 1,
        bar: 1
      });
      expect(countClassnames([])).toEqual({});
    });
  });
});

it("should not provide redundant class names", () => {
  const builder = () => BEM("MyComponent");

  const bemHelperNames = classNamesAsArray(
    [
      builder()
        .is("foo")
        .toString(),
      builder()
        .is("bar")
        .toString()
    ].join(" ")
  );

  // Sanity check, this asserts that the BEM helper is providing redundant class names.
  // This asserts that at least one class name shows up twice.
  expect(hasRedundantNames(bemHelperNames)).toBe(true);

  const classNames = classNamesAsArray(
    getBEMModifierClassnames(builder, {
      foo: true,
      bar: true
    })
  );

  expect(hasRedundantNames(classNames)).toBe(false);
  expect(new Set(classNames)).toEqual(new Set(bemHelperNames));
});
