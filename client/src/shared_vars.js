function pushState(state) {
  window.history.pushState(state, "");
};

let shared_vars = {
  "theme": "default",
  "currentPlace": "index",
  "pushState": pushState,
  "forward": () => shared_vars.pushState(shared_vars.currentPlace),
  "back": (ev) => shared_vars.gotoPage[ev.state](),
  "gotoPage": {}
};
export default shared_vars;
