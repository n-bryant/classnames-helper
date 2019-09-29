import createClassNameHelper from "./index";
import warning from "warning";
import { camelCase } from "lodash";
jest.mock("warning", () => jest.fn());

afterEach(() => {
  jest.resetAllMocks();
});

const componentName = "MyComponent";
const elementName = "subElement";
const truthyModifier = "isFoo";
const falsyModifier = "isBar";

it("should retrieve the component name to supply props at a component's render time", () => {
  const props = { classes: { root: "root" } };
  expect(createClassNameHelper(componentName, props).root()).toEqual(
    createClassNameHelper(componentName)(props).root()
  );
});

it("should throw if props are not supplied after currying", () => {
  expect(() => {
    createClassNameHelper(componentName)();
  }).toThrow();
  expect(() => {
    createClassNameHelper(componentName)(null);
  }).toThrow();
  expect(() => {
    createClassNameHelper(componentName)("foo");
  }).toThrow();
  expect(() => {
    createClassNameHelper(componentName)({});
  }).not.toThrow();
});

it("should warn if props does not provide a 'classes' object representing the component's CSS API", () => {
  createClassNameHelper(componentName)({ classes: {} });
  expect(warning).not.toHaveBeenCalledWith(false, expect.anything());
  createClassNameHelper(componentName)({});
  expect(warning).toHaveBeenCalledWith(false, expect.anything());
});

describe("without props", () => {
  it("should generate a BEM Block identifier", () => {
    expect(createClassNameHelper(componentName).root()).toHaveClass(
      componentName
    );
  });
  it("should generate conditional BEM modifiers for the root", () => {
    const rootClassNames = createClassNameHelper(componentName).root({
      [truthyModifier]: true,
      [falsyModifier]: false
    });
    expect(rootClassNames).toHaveClass(componentName);
    expect(rootClassNames).toHaveClass(`${componentName}--${truthyModifier}`);
    expect(rootClassNames).not.toHaveClass(
      `${componentName}--${falsyModifier}`
    );
  });
  it("should generate BEM element names", () => {
    expect(
      createClassNameHelper(componentName).element(elementName)
    ).toHaveClass(`${componentName}__${elementName}`);
  });
  it("should generate conditional BEM modifiers for elements", () => {
    const elementClassNames = createClassNameHelper(componentName).element(
      elementName,
      {
        [truthyModifier]: true,
        [falsyModifier]: false
      }
    );
    expect(elementClassNames).toHaveClass(`${componentName}__${elementName}`);
    expect(elementClassNames).toHaveClass(
      `${componentName}__${elementName}--${truthyModifier}`
    );
    expect(elementClassNames).not.toHaveClass(
      `${componentName}__${elementName}--${falsyModifier}`
    );
  });
});

describe("with props", () => {
  it("should supply the root with props.className", () => {
    const props = {
      className: "props.className"
    };
    const rootClassNames = createClassNameHelper(componentName)(props).root();
    expect(rootClassNames).toHaveClass(componentName);
    expect(rootClassNames).toHaveClass(props.className);
  });
  it("should warn if props.classes is not an object", () => {
    createClassNameHelper(componentName)({
      classes: {}
    });
    expect(warning).not.toHaveBeenCalledWith(false, expect.anything());
    createClassNameHelper(componentName)({});
    expect(warning).toHaveBeenCalledWith(false, expect.anything());
  });
  it("should supply the root with props.classes.root", () => {
    const props = {
      classes: {
        root: "props.classes.root"
      }
    };
    const rootClassNames = createClassNameHelper(componentName)(props).root();
    expect(rootClassNames).toHaveClass(componentName);
    expect(rootClassNames).toHaveClass(props.classes.root);
  });
  it("should supply the root with CSS API conditional modifiers", () => {
    const props = {
      classes: {
        [truthyModifier]: "props.classes.isFoo",
        [falsyModifier]: "props.classes.isBar"
      }
    };
    const rootClassNames = createClassNameHelper(componentName)(props).root({
      [truthyModifier]: true,
      [falsyModifier]: false
    });
    expect(rootClassNames).toHaveClass(props.classes[truthyModifier]);
    expect(rootClassNames).not.toHaveClass(props.classes[falsyModifier]);
  });
  it("should warn when generating names for modifiers that aren't supplied in props.classes (the CSS API)", () => {
    const props = {
      classes: {
        [truthyModifier]: "props.classes.isFoo",
        [falsyModifier]: "props.classes.isBar"
      }
    };
    createClassNameHelper(componentName)(props).root({
      [truthyModifier]: true,
      [falsyModifier]: false
    });
    expect(warning).not.toHaveBeenCalledWith(false, expect.anything());
    createClassNameHelper(componentName)({}).root({
      [truthyModifier]: true,
      [falsyModifier]: false
    });
    expect(warning).toHaveBeenCalledWith(false, expect.anything());
  });
  it("should supply sub elements with their CSS API class name", () => {
    const props = {
      className: "props.className",
      classes: {
        root: "props.classes.root",
        [elementName]: "props.classes.subElement"
      }
    };
    const elementClassNames = createClassNameHelper(componentName)(
      props
    ).element(elementName);
    expect(elementClassNames).toHaveClass(props.classes[elementName]);
    expect(elementClassNames).not.toHaveClass(props.className);
    expect(elementClassNames).not.toHaveClass(props.classes.root);
  });
  it("should warn when generating names for sub elements that aren't supplied in props.classes (the CSS API)", () => {
    const props = {
      className: "props.className",
      classes: {
        root: "props.classes.root",
        [elementName]: "props.classes.subElement"
      }
    };
    createClassNameHelper(componentName)(props).element(elementName);
    expect(warning).not.toHaveBeenCalledWith(false, expect.anything());
    createClassNameHelper(componentName)({}).element(elementName);
    expect(warning).toHaveBeenCalledWith(false, expect.anything());
  });
  it("should supply sub elements with their CSS API conditional modifiers", () => {
    const props = {
      classes: {
        [truthyModifier]: "props.classes.isFoo",
        [falsyModifier]: "props.classes.isBar",
        [camelCase([
          elementName,
          truthyModifier
        ])]: "props.classes.subElementIsFoo",
        [camelCase([
          elementName,
          falsyModifier
        ])]: "props.classes.subElementIsBar"
      }
    };
    const elementClassNames = createClassNameHelper(componentName)(
      props
    ).element(elementName, {
      [truthyModifier]: true,
      [falsyModifier]: false
    });
    expect(elementClassNames).toHaveClass(
      props.classes[camelCase([elementName, truthyModifier])]
    );
    expect(elementClassNames).not.toHaveClass(
      props.classes[camelCase([elementName, falsyModifier])]
    );
    expect(elementClassNames).not.toHaveClass(props.classes[truthyModifier]);
    expect(elementClassNames).not.toHaveClass(props.classes[falsyModifier]);
  });
});
