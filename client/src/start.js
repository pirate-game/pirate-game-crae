import React from 'react';

import shared_vars from './shared_vars';

export default class Start extends shared_vars.ThemeDependentComponent {
  componentDidMount() {
    // socket stuff etc.
    console.log("did mount");
    super.componentDidMount();
  };
  componentWillUnmount() {
    super.componentWillUnmount();
    // socket stuff etc.
    console.log("will unmount");
  };
  render() {
    if (this.state.data) {
      return <p>{this.state.data.introduction_before[0]}</p>;
    } else {
      return <p>Start Content</p>;
    };
  };
};
