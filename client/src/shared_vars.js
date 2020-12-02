import React from 'react';
import ReactDOM from 'react-dom';

function renderIn(content, place) {
    ReactDOM.render(content, document.getElementById(place));
};

function removeFirstOccurrenceIn(e, arr) {
    const index = arr.indexOf(e);
    if (index != -1) {
        arr.splice(index, 1);
    };
    return arr;
};

const themeDependents = []; // const objects can be mutated, but cannot be emplaced

class ThemeDependentComponent extends React.Component {
    constructor() {
        super();
        this.state = { data: null };
    };
    componentDidMount() {
        this.updateTheme();
        shared_vars.themeDependents.push(this);
    };
    componentWillUnmount() {
        shared_vars.removeFirstOccurrenceIn(this, shared_vars.themeDependents);
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

function setTheme() {
    shared_vars.theme = document.getElementById("theme").value;
    const themeDependents = shared_vars.themeDependents;
    const len = themeDependents.length;
    for (let i = 0; i < len; ++i) {
        themeDependents[i].updateTheme();
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

function unloadFn(event) { event.returnValue=""; };

function defaultWrapComponent(cmp) {
    return <React.Suspense fallback={shared_vars.defaultLoading}><br />{cmp}</React.Suspense>;
}; 

function sortByScore(results) {
    const out = results.slice();
    out.sort((a, b) => ((a.score < b.score) ? 1 : -1));
    return out;
};

let shared_vars = {
    "renderIn": renderIn,
    "theme": "default",
    "gotoPage": {},
    "defaultLoading": <div>Loading...</div>,
    "symbols": ["rob", "kill", "present", "declareScore", "swap", "chooseNextSquare", "shield", "mirror", "goToZero", "double", "bank"],
    "ThemeDependentComponent": ThemeDependentComponent,
    "themeDependents": themeDependents,
    "setTheme": setTheme,
    "intersperseWith": intersperseWith,
    "twoNewLines": <React.Fragment><br /><br /></React.Fragment>,
    "unloadFn": unloadFn,
    "unload_able": true,
    "preventUnload": (() => { if (shared_vars.unload_able)  { window.addEventListener(   "beforeunload", shared_vars.unloadFn); shared_vars.unload_able = false; }; }),
    "allowUnload":   (() => { if (!shared_vars.unload_able) { window.removeEventListener("beforeunload", shared_vars.unloadFn); shared_vars.unload_able = true;  }; }),
    "authenticHash": "",
    "removeFirstOccurrenceIn": removeFirstOccurrenceIn,
    "defaultWrapComponent": defaultWrapComponent,
    "sortByScore": sortByScore
};
export default shared_vars;
