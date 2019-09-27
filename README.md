# `classnames-helper`

A support library for achieving extensible styling for reusable components and setting BEM semantic class names for component identification. This library provides a companion tool for React components that eases the burden of implementing a component's [CSS API](https://material-ui.com/customization/overrides/) in tandem with BEM identifiers.

The goal of this "classnames helper" is to provide a tool that removes the need to employ multiple helper libraries to build class names (eg. [classnames](https://github.com/JedWatson/classnames) and [bem-helper-js](https://github.com/14islands/bem-helper-js)) by selecting classes from a component's CSS API (`props.classes`) and directly associating each with BEM identifiers and modifiers.
