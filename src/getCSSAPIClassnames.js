import warning from "warning";
import { get, camelCase } from "lodash";
import listClasses from "./listClasses";
import uniqueClassnames from "./uniqueClassnames";

/**
 * Retrieve the CSS API class names (from props.classes) that correspond to the provided modifiers and optional sub
 * element. When a sub element is provided, an element's modifier class name will be pulled from 'classes' at a property
 * camelCase(elementName, modifierName).
 * @param {Object} [props={}] A component's props.
 * @param {Object} [props.classes={}] A component's CSS API.
 * @param {Object} [modifiers={}] An object specifying possible modifier class names (the keys) and whether they
 * should be applied (the values).
 * @param {String} [elementName=null] A String identifiying the BEM sub-element that's being modified
 * @returns {Array} An array of classnames drawn from props.classes by evaluating conditional 'modifiers'
 */
export default function getCSSAPIClassnames(
  props = {},
  modifiers = {},
  elementName = null
) {
  const classes = get(props, "classes", {});
  return uniqueClassnames(
    Object.keys(modifiers).reduce((accum, modifierName) => {
      const modifierCSSAPIName = elementName
        ? camelCase([elementName, modifierName])
        : modifierName;
      warning(
        !props ||
          (classes.hasOwnProperty(modifierCSSAPIName) &&
            typeof classes[modifierCSSAPIName] === "string"),
        `Expected props.classes to have a property '${modifierCSSAPIName}' for the modifier of the same name. Are you applying modifiers that aren't a part of your CSS API? ${listClasses(
          classes
        )}`
      );
      return {
        ...accum,
        [classes[modifierCSSAPIName]]: modifiers[modifierName]
      };
    }, {})
  );
}
