import getComponentName from "./getComponentName";

describe("getComponentName", () => {
  it("should resolve a component's display name", () => {
    const component = () => {};
    component.displayName = "MyComponent";
    expect(getComponentName(component)).toEqual(component.displayName);
  });

  it("should resolve a function's name if the component does not have a display name", () => {
    function MyComponent() {}
    expect(getComponentName(MyComponent)).toEqual("MyComponent");
  });

  it("should resolve the component's class name for class components", () => {
    class MyComponent {}
    expect(getComponentName(MyComponent)).toEqual("MyComponent");
  });

  it("should just return the component's string name when supplied as a string, meaning the caller has supplied an explicit name", () => {
    const expectedName = "MyComponent";
    expect(getComponentName(expectedName)).toEqual(expectedName);
  });

  it("should throw for unnamed functions", () => {
    expect(() => {
      getComponentName(() => {});
    }).toThrow();
  });

  it("should throw for input other than components and non-empty names as strings", () => {
    expect(() => {
      getComponentName(null);
    }).toThrow();
    expect(() => {
      getComponentName();
    }).toThrow();
    expect(() => {
      getComponentName("");
    }).toThrow();
    expect(() => {
      getComponentName("  ");
    }).toThrow();
  });
});
