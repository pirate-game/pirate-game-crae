import React from 'react';
import ReactDOM from 'react-dom';

export function renderIn(content, place) {
    ReactDOM.render(content, document.getElementById(place));
};

export const gotoPage = {};

export const defaultLoading = <div>Loading...</div>;

export const symbols = ["rob", "kill", "present", "declareScore", "swap", "chooseNextSquare", "shield", "mirror", "goToZero", "double", "bank"];

export const twoNewLines = <React.Fragment><br /><br /></React.Fragment>;

export function removeFirstOccurrenceIn(e, arr) {
    const index = arr.indexOf(e);
    if (index != -1) {
        arr.splice(index, 1);
    };
    return arr;
};

export const themeDependents = []; // const objects can be mutated, but cannot be emplaced

export class ThemeDependentComponent extends React.Component {
    constructor() {
        super();
        this.state = { data: null };
    };
    componentDidMount() {
        this.updateTheme();
        themeDependents.push(this);
    };
    componentWillUnmount() {
        removeFirstOccurrenceIn(this, themeDependents);
    };
    updateTheme() {
        const theme = mutables.theme;
        import('./theme_info/'+theme).then(d => {
            if (mutables.theme == theme) {
                this.setState({ data: d.default });
            };
        });
    };
};

export function setTheme() {
    mutables.theme = document.getElementById("theme").value;
    const len = themeDependents.length;
    for (let i = 0; i < len; ++i) {
        themeDependents[i].updateTheme();
    };
};

export function intersperseWith(array, element) {
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

export function unloadFn(event) { event.returnValue=""; };

export const preventUnload = () => { if (mutables.unload_able)  { window.addEventListener(   "beforeunload", unloadFn); mutables.unload_able = false; }; };
export const allowUnload   = () => { if (!mutables.unload_able) { window.removeEventListener("beforeunload", unloadFn); mutables.unload_able = true;  }; };

export function defaultWrapComponent(cmp) {
    return <React.Suspense fallback={defaultLoading}><br />{cmp}</React.Suspense>;
}; 

export const mutables = {
    theme: "default",
    unload_able: true,
    authenticHash: ""
};
