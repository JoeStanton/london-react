import React from 'react-native';

function AssertReact(Component) {
  if (!(Component.prototype instanceof React.Component)) {
    throw new Error('Specified target is not a React component.');
  }
}

export function Debug(Component) {
  AssertReact(Component);

  const original = Component.prototype.render;
  Component.prototype.render = function() {
    console.log(
      `
        Props: ${JSON.stringify(this.props)}
        State: ${JSON.stringify(this.state)}
      `
    );
    return original.apply(this, arguments);
  };
  return Component;
}

export function PureRender(Component) {
  AssertReact(Component);
  Component.prototype.shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate;
  return Component;
}
