import React from 'react';

class ThemeDependentComponent extends React.Component {
  constructor() {
		super();
    this.state = { data: null };
    this.updateTheme();
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

let shared_vars = {
  "theme": "default",
  "gotoPage": {},
  "defaultLoading": <div>YARR! This be loadin'...</div>,
  "symbols": ["rob", "kill", "present", "declareScore", "swap", "chooseNextSquare", "shield", "mirror", "goToZero", "double", "bank"],
  "ThemeDependentComponent": ThemeDependentComponent
};
export default shared_vars;
