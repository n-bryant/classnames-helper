import classnames from "classnames";
import uniq from "lodash/uniq";

/**
 * Identical to the 'classnames' library, with the exception that it removes redundant class names and only returns
 * an array of unique names.
 * @param {Array<Object|Array|String>} args
 * @returns {Array}
 * @see (@link https://github.com/JedWatson/classnames)
 */
export default function uniqueClassnames(...args) {
  const names = classnames(...args);
  return names ? uniq(names.split(" ")) : [];
}
