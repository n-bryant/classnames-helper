import getCSSAPIClassnames from "./getCSSAPIClassnames";
import { camelCase } from "lodash";

it("should handle optional props and classes", () => {
  expect(getCSSAPIClassnames(null, {})).toEqual([]);
  expect(getCSSAPIClassnames({}, {})).toEqual([]);
  expect(getCSSAPIClassnames({ classes: {} }, {})).toEqual([]);
});

it("should map modifiers to CSS API names", () => {
  const props = {
    classes: {
      foo: "foo-generated",
      bar: "bar-generated"
    }
  };
  const modifiers = {
    foo: true,
    bar: false
  };
  expect(getCSSAPIClassnames(props, modifiers)).toEqual(["foo-generated"]);
});

it("should map element modifiers to CSS API names using a camel case convention", () => {
  const props = {
    classes: {
      foo: "foo-generated",
      someElementFoo: "some-element-foo-generated",
      bar: "bar-generated",
      someElementBar: "some-element-bar-generated"
    }
  };
  const modifiers = {
    foo: true,
    bar: false
  };
  expect(getCSSAPIClassnames(props, modifiers, "someElement")).toEqual([
    "some-element-foo-generated"
  ]);
});

it("should log an error if no elementName is provided and the classes object passed does not include a property matching a provided modifier", () => {
  const props = {
    classes: {
      foo: "foo-generated"
    }
  };
  const modifiers = {
    bar: true
  };
  console.error = jest.fn();
  getCSSAPIClassnames(props, modifiers, null);
  expect(console.error).toHaveBeenCalled();
});

it("should log an error if an elementName is provided and the classes object passed does not include a property matching a camelcase concatenation of the element name and provided modifier", () => {
  const props = {
    classes: {
      foo: "foo-generated"
    }
  };
  const modifiers = {
    bar: true
  };
  console.error = jest.fn();
  getCSSAPIClassnames(props, modifiers, "elementName");
  expect(console.error).toHaveBeenCalled();
});

it("should not log an error if no elementName is provided and the classes object passed includes a property matching a provided modifier", () => {
  const props = {
    classes: {
      foo: "foo-generated"
    }
  };
  const modifiers = {
    foo: true
  };
  console.error = jest.fn();
  getCSSAPIClassnames(props, modifiers, null);
  expect(console.error).not.toHaveBeenCalled();
});

it("should not log an error if an elementName is provided and the classes object passed does include a property matching a camelcase concatenation of the element name and provided modifier", () => {
  const elementName = "elementName";
  const modifierName = "bar";
  const props = {
    classes: {
      foo: "foo-generated",
      [camelCase([elementName, modifierName])]: "elementNameBar-generated"
    }
  };
  const modifiers = {
    bar: true
  };
  console.error = jest.fn();
  getCSSAPIClassnames(props, modifiers, elementName);
  expect(console.error).not.toHaveBeenCalled();
});
