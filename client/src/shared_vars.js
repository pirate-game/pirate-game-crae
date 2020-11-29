import React from 'react';

const themeDependents = []; // const objects can be mutated, by cannot be emplaced

class ThemeDependentComponent extends React.Component {
  constructor() {
    super();
    this.state = { data: null };
    this.updateTheme();
    shared_vars.themeDependents.push(this);
  };
  updateTheme() {
    const theme = shared_vars.theme;
    import('./theme_info/'+theme).then(d => {
      if (shared_vars.theme == theme) {
        this.setState({ data: d.default });
      };
    });
  };
};

function intersperseWith(array, element) {
    const len = array.length;
    if (len) {
        let out = [array[0]];
        for (let i = 1; i < len; ++i) { // it is meant to start at 1, so that the first element is missed
            out = out.concat([element, array[i]]);
        };
        return out;
    } else {
        return array;
    };
};

let shared_vars = {
  "theme": "default",
  "gotoPage": {},
  "defaultLoading": <div>Loading...</div>,
  "symbols": ["rob", "kill", "present", "declareScore", "swap", "chooseNextSquare", "shield", "mirror", "goToZero", "double", "bank"],
  "ThemeDependentComponent": ThemeDependentComponent,
  "themeDependents": themeDependents,
  "intersperseWith": intersperseWith,
  "twoNewLines": <React.Fragment><br /><br /></React.Fragment>
};
export default shared_vars;
