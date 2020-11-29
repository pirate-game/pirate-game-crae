import React from 'react';

/*function pushState(state) {
  window.history.pushState(state, "");
};*/

let shared_vars = {
  "theme": "default",
  //"currentPlace": "index",
  //"pushState": pushState,
  //"forward": () => shared_vars.pushState(shared_vars.currentPlace),
  //"back": (ev) => { ev.preventDefault(); shared_vars.gotoPage[ev.state](); },
  "gotoPage": {},
  "defaultLoading": <div>YARR! This be loadin'...</div>
};
export default shared_vars;
