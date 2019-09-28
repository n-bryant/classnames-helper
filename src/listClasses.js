export default function listClasses(classes) {
  return `The classes provided in props are ['${Object.keys(classes).join(
    "', '"
  )}']`;
}
