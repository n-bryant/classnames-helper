# `classnames-helper`

A support library for achieving extensible styling for reusable components and setting BEM semantic class names for component identification. This library provides a companion tool for React components that eases the burden of implementing a component's [CSS API](https://material-ui.com/customization/overrides/) in tandem with BEM identifiers.

The goal of this "classnames helper" is to provide a tool that removes the need to employ multiple helper libraries to build class names (eg. [classnames](https://github.com/JedWatson/classnames) and [bem-helper-js](https://github.com/14islands/bem-helper-js)) by selecting classes from a component's CSS API (`props.classes`) and directly associating each with BEM identifiers and modifiers.

## Getting Started

```bash
  # via npm
  npm install @n_bryant/classnames-helper

  # via yarn
  yarn add @n_bryant/classnames-helper
```

## Usage

### Recommended Usage With React

The helper expects to receive a component's name, and the helper should be attached to the component statically.

```javascript
MyComponent.classnames = createClassNameGenerator("MyComponent");
```

Next, the helper must be applied with props to build the prop specific class name helper.
The helper expects a classes prop within the props object passed to it.

```javascript
function MyComponent(props) {
  const classnames = MyComponent.classnames(props);
}
```

Lastly, the class name helpers can be applied to the root or sub elements with optional modifiers.

```javascript
function MyComponent(props) {
  const classnames = MyComponent.classnames(props);
  return (
    <div className={classnames.root({ isFoo: true })}>
      <span className={(classnames.element("mySpan"), { isBar: true })}>
        Span Content
      </span>
    </div>
  );
}
```

#### Complete Example

```javascript
import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import createClassNameHelper from "classnames-helper";
import theme from "../lib/theme";

import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export function ExampleComponent(props) {
  const { classes, open, onClose, title, children } = props;
  const classnames = ExampleComponent.classnames(classes);
  return (
    <Drawer {...props} className={classnames.root({ isOpen: open })}>
      {/** */}
      <div className={classnames.element("title")}>
        <Button
          onClick={onClose}
          className={classnames.element("titleCloseButton")}
        >
          <Typography className={classnames.element("titleCloseButtonText")}>
            Close
          </Typography>
        </Button>
        <Typography
          className={classnames.element("titleText", {
            isHighlighted: open
          })}
        >
          {title}
        </Typography>
      </div>
      {children}
    </Drawer>
  );
}
ExampleComponent.classnames = createClassNameGenerator("ExampleComponent");
ExampleComponent.propTypes = {
  classes: PropTypes.shape({
    /** Applied to the root element */
    root: PropTypes.string,
    /** Modifier applied to the root element when the Drawer is open */
    isOpen: PropTypes.string,
    /** Applied to the title container, wrapping the text and close button */
    title: PropTypes.string,
    /** Applied to the title text */
    titleText: PropTypes.string,
    /** Applied to the title text when the Drawer is open and the title gets highlighted*/
    titleTextIsHighlighted: PropTypes.string,
    /** Applied to the close Button in the title container */
    titleCloseButton: PropTypes.string,
    /** Applied to the close button text inside the Button in the title container */
    titleCloseButtonText: PropTypes.string
  }),
  /** Whether the Drawer is open or not */
  open: PropTypes.bool,
  /** The Drawer's title */
  title: PropTypes.string,
  /** Handler for when the Drawer is closed */
  onClose: PropTypes.func
};
ExampleComponent.defaultProps = {
  classes: {},
  open: false
};

// styles set here with property names providing the keys of the classes object
const styles = {
  root: {},
  isOpen: {},
  title: {},
  titleText: {},
  titleTextIsHighlighted: {},
  titleCloseButton: {},
  titleCloseButtonText: {}
};

export default withStyles(styles)(ExampleComponent);
```

### Raw API

```typescript
declare function rootClassNameHelper(modifiers?: object): string;
declare function elmentClassNameHelper(elementName: string, modifiers?: object): string;

interface PropsWithClasses {
  className?: string;
  classes?: object
}

interface ClassNameHelper {
  root: rootClassNameHelper;
  element elmentClassNameHelper;
}

interface BEMHelperWaitingForProps extends ClassNameHelper {
  (props: object) => ClassNameHelper
}

declare function createClassNameHelper(
  componentOrName: string | function,
  props: PropsWithClasses
): ClassNameHelper;
declare function createClassNameHelper(
  componentOrName: string | function
): BEMHelperWaitingForProps;
```

#### Construction

To create a class name helper, the factory `createClassNameHelper` will need a component name and props that contain the optional properties `className` and `classes` (for a component's [CSS API](https://material-ui.com/customization/overrides/)). If props are not supplied, the component name will be derived.

```javascript
import createClassNameHelper from "classnames-helper";
const props = {
  className: "ClassNameFromProp",
  classes: {
    root: "rootFromClasses",
    subElement: "subElementFromClasses"
  }
};
const classnames = createClassNameHelper("MyComponent")(props);
const rootClassNames = classnames.root();
```

#### Root Element

The helper will select `props.className` and `props.classes.root` from the component's props as well as provide a BEM block identifier based on the component's name.

```javascript
const classnames = createClassNameHelper("MyComponent")({
  className: "ClassNameFromProp",
  classes: {
    root: "rootFromClasses"
  }
});
const rootClassNames = classnames.root().split(" ");
expect(rootClassNames).toContain("MyComponent");
expect(rootClassNames).toContain("ClassNameFromProp");
expect(rootClassNames).toContain("rootFromClasses");
```

#### Sub Elements

The helper can produce BEM sub element identifiers and draw element class names from `props.classes` as well.

```javascript
const classnames = createClassNameHelper("MyComponent")({
  classes: {
    subElement: "subElementFromClasses"
  }
});
const elementClassNames = classnames.element("subElement").split(" ");
expect(elementClassNames).toContain("MyComponent__subElement");
expect(elementClassNames).toContain("subElementFromClasses");
```

#### Modifiers

The helper can produce BEM modifier identifiers and conditionally draw modifier class names from `props.classes`. When modifying sub elements, this expects a camelCase naming convention for properties in `classes` equivalent to `_.camelCase([elementName, modifier])`.

```javascript
const classnames = createClassNameHelper("MyComponent")({
  classes: {
    isOpen: "rootIsOpenModifier",
    subElementSelected: "subElementIsSelectedModifier"
  }
});
const rootClassNames = classnames.root({ isOpen: true }).split(" ");
expect(rootClassNames).toContain("MyComponent");
expect(rootClassNames).toContain("MyComponent--isOpen");
expect(rootClassNames).toContain("rootIsOpenModifier");
// When the modifier condition is falsy, the modifier class names will not get added
expect(classnames.root({ isOpen: false }).split(" ")).not.toContain(
  "MyComponent--isOpen"
);
expect(classnames.root({ isOpen: false }).split(" ")).not.toContain(
  "rootIsOpenModifier"
);

const elementClassName = classnames
  .element("subElement", { selected: true })
  .split(" ");
expect(elementClassName).toContain("MyComponent__subElement");
expect(elementClassName).toContain("MyComponent__subElement--selected");
expect(elementClassName).toContain("subElementIsSelectedModifier");
// When the modifier condition is falsy, the modifier class names will not get added
expect(
  classnames.element("subElement", { selected: false }).split(" ")
).not.toContain("MyComponent__subElement--selected");
expect(
  classnames.element("subElement", { selected: false }).split(" ")
).not.toContain("subElementIsSelectedModifier");
```

#### Just BEM Identifiers

If you want to use the helper outside of a component, perhaps to generate BEM identifiers for a component in absence of props, simply invoke the helper without props.

```javascript
const classnames = createClassNameHelper("MyComponent");
const rootClassNames = classnames.root({ isOpen: true }).split(" ");
expect(rootClassNames).toContain("MyComponent");
expect(rootClassNames).toContain("MyComponent--isOpen");
```
