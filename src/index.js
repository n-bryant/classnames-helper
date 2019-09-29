import invariant from "invariant";
import warning from "warning";
import BEM from "bem-helper-js";
import get from "lodash/get";
import getComponentName from "./getComponentName";
import getBEMModifierClassnames from "./getBEMModifierClassnames";
import getCSSAPIClassnames from "./getCSSAPIClassnames";
import uniqueClassnames from "./uniqueClassnames";

/**
 * A generator that will provide class names for a component's root or sub elements. Accepts objects for specifying
 * conditional modifiers. Generated class names will contain BEM identifiers.
 */
class ClassNameGenerator {
  /**
   *
   * @param {Function|String} componentOrName A component with a 'name' or 'displayName' property or the component name
   * as a string.
   * @param {Object} [props=null] The component's props.
   * @param {Object} [props.classes=null] Classnames provided to the component as a part of it's CSS API, most likely
   * from Material-UI's withStyles or JSS.
   */
  constructor(componentOrName, props = null) {
    this.componentName = getComponentName(componentOrName);
    warning(
      !props ||
        (props.hasOwnProperty("classes") && typeof props.classes === "object"),
      "When props are provided, the classname generator expects to receive an object of 'classes' on props to select a component's CSS API. This generator assumes you're using CSS in JS patterns, are you using JSS or MUI withStyles() correctly?"
    );
    this.props = props;
  }

  /**
   * Generates class names for the component's root, conditionally applying modifiers according to their conditions.
   * @type {Function}
   * @param {Object} [modifiers={}] An object specifying possible modifier class names (the keys) and whether they
   * should be applied (the values).
   * @returns {String}
   */
  root = (modifiers = {}) => {
    const modifierBEMNames = getBEMModifierClassnames(
      () => BEM(this.componentName),
      modifiers
    );

    const cssAPIRootModifierClassNames = getCSSAPIClassnames(
      this.props,
      modifiers
    );
    return uniqueClassnames(
      BEM(this.componentName).toString(),
      modifierBEMNames,
      get(this.props, "className"),
      get(this.props, "classes.root"),
      cssAPIRootModifierClassNames
    ).join(" ");
  };

  /**
   * Generates class names for the component's named sub element, conditionally applying modifiers to the element
   * according to their conditions.
   * @type {Function}
   * @param {String} elementName
   * @param {Object} [modifiers={}] An object specifying possible modifier class names (the keys) and whether they
   * should be applied (the values).
   * @returns {String}
   */
  element = (elementName, modifiers = {}) => {
    invariant(
      elementName && typeof elementName === "string",
      "Expected to generate class names for a named sub element. Required a string element name."
    );

    const modifierBEMNames = getBEMModifierClassnames(
      () => BEM(this.componentName).el(elementName),
      modifiers
    );
    const cssAPIElementModifierClassNames = getCSSAPIClassnames(
      this.props,
      modifiers,
      elementName
    );
    const cssAPIElementClassName = get(this.props, ["classes", elementName]);
    warning(
      !this.props ||
        (cssAPIElementClassName && typeof cssAPIElementClassName === "string"),
      `Expected props.classes to have property '${elementName}' to represent the sub element of the same name. Are you identifying elements that aren't a part of your CSS API?`
    );
    return uniqueClassnames(
      BEM(this.componentName)
        .el(elementName)
        .toString(),
      modifierBEMNames,
      cssAPIElementClassName,
      cssAPIElementModifierClassNames
    ).join(" ");
  };
}

export default function createClassNameGenerator(componentOrName, props) {
  if (arguments.length === 1) {
    const curried = props => createClassNameGenerator(componentOrName, props);
    return Object.assign(curried, new ClassNameGenerator(componentOrName));
  }
  invariant(
    props && typeof props === "object",
    "The classname generator expects to receive an object of props to select class names for a component's CSS API"
  );
  return new ClassNameGenerator(componentOrName, props);
}
