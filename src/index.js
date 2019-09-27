import invariant from "invariant";
import warning from "warning";
import getComponentName from "./getComponentName";

/**
 * A helper that will provide class names for a component's root or sub elements. Accepts objects for specifying
 * conditional modifiers. Generated class names will contain BEM identifiers.
 */
class ClassNameHelper {
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
      "When props are provided, the classname helper expects to receive an object of 'classes' on props to select a component's CSS API. This helper assumes you're using CSS in JS patterns, are you using JSS or MUI withStyles() correctly?"
    );
    this.props = props;
  }
}

export default function createClassNameHelper(componentOrName, props) {
  if (arguments.length === 1) {
    const curried = props => createClassNameHelper(componentOrName, props);
    return Object.assign(curried, new ClassNameHelper(componentOrName));
  }
  invariant(
    props && typeof props === "object",
    "The classname helper expects to receive an object of props to select class names for a component's CSS API"
  );
  return new ClassNameHelper(componentOrName, props);
}
