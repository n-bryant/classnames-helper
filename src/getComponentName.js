import invariant from "invariant";

/**
 * Identify the name to use for a component by inspecting a component's static 'displayName' or 'name' properties.
 * @param {Function|String} componentOrName A component with a 'name' or 'displayName' property or the component name
 * as a string OR an explicit string name for the component.
 * @returns {String} The name to use for the component's semantic class names.
 */
export default function getComponentName(componentOrName) {
  if (typeof componentOrName === "function") {
    invariant(
      componentOrName.displayName || componentOrName.name,
      "When supplying a component to the class name helper, it must have either a 'displayName' or 'name' property"
    );
  } else {
    invariant(
      componentOrName && typeof componentOrName === "string",
      "A component name must be supplied to the class name helper as a string or as a named function/Component with a 'displayName' or 'name' property."
    );
  }
  const componentName = (typeof componentOrName === "string"
    ? componentOrName
    : componentOrName.displayName
    ? componentOrName.displayName
    : componentOrName.name
  ).trim();
  invariant(
    !!componentName,
    `Expected to resolve a non-empty component name. After trimming whitespace, found '${componentName}'`
  );
  return componentName;
}
