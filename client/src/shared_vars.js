function pushState(state) {
  window.history.pushState(state, "");
};

let shared_vars = {
  "theme": "default",
  "currentPlace": "index",
  "pushState": pushState,
  "gotoPage": {}
};
export default shared_vars;
