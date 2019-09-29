import uniqueClassnames from "./uniqueClassnames";

/**
 * Using a bem-helper-js builder, reduce an object of conditional modifiers into an array of BEM modifier classnames
 * @param {Function} bemBuilderFactory A function that returns a bem-helper-js builder with the right scoping.
 * @param {Object} [modifiers={}] An object specifying possible modifier class names (the keys) and whether they
 * should be applied (the values).
 * @returns {Array} An array of class names
 */
export default function getBEMModifierClassnames(
  bemBuilderFactory,
  modifiers = {}
) {
  return uniqueClassnames(
    Object.keys(modifiers).reduce(
      (accum, modifierName) => [
        ...accum,
        ...bemBuilderFactory()
          .is(modifierName, modifiers[modifierName])
          .toString()
          .split(" ")
      ],
      []
    )
  );
}
