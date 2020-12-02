import React from 'react';
import ReactDOM from 'react-dom';

export function renderIn(content, place) {
    ReactDOM.render(content, document.getElementById(place));
};

export let theme = "default";

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
        const theme_ = theme;
        import('./theme_info/'+theme_).then(d => {
            if (theme == theme_) {
                this.setState({ data: d.default });
            };
        });
    };
};

export function setTheme() {
    theme = document.getElementById("theme").value;
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

export let unload_able = true;

export const preventUnload = () => { if (unload_able)  { window.addEventListener(   "beforeunload", unloadFn); unload_able = false; }; };
export const allowUnload   = () => { if (!unload_able) { window.removeEventListener("beforeunload", unloadFn); unload_able = true;  }; };

export let authenticHash = "";

export function defaultWrapComponent(cmp) {
    return <React.Suspense fallback={defaultLoading}><br />{cmp}</React.Suspense>;
}; 

export function sortByScore(results) {
    const out = results.slice();
    out.sort((a, b) => ((a.score < b.score) ? 1 : -1));
    return out;
};

export class PopUps extends React.Component {
    constructor() {
        super();
        
        this.state = { children: [] };
        
        this.clear = this.clear.bind(this);
        this.addPopUp = this.addPopUp.bind(this);
    };
    clear() {
        this.setState({ children: [] });
        return this;
    };
    addPopUp(description) {
        this.setState({ 
            children: this.state.children.concat([
                <div id={description.id} className="popUp"><div>
                    <h3>{description.title}</h3>
                    <hr />
                    <p>{intersperseWith(description.textLines || [], <br />)}</p>
                    {description.btn && <button className="close" onClick={description.btn.onClick}>{description.btn.text}</button>}
                </div></div>
            ]) 
        });
        return this;
    };
    render() {
        return <div id="popUps">{this.state.children}</div>;
    };
};

/*
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
    "sortByScore": sortByScore,
    "PopUps": PopUps
};
export default shared_vars;
*/
