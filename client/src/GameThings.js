import React from 'react';
import ReactDOM from 'react-dom';

import * as shared_vars from './shared_vars';

import './css/GameThings.css';


export function sortByScore(results) {
    const out = results.slice();
    out.sort((a, b) => ((a.score < b.score) ? 1 : -1));
    return out;
};

export class SocketfulComponent extends shared_vars.ThemeDependentComponent {
    // would be CRTP in C++
    componentDidMount() {
        super.componentDidMount();
        this.socket = io();
    };
    componentWillUnmount() {
        super.componentWillUnmount();        
        if (this.socket.connected) this.socket.disconnect();
    };
    render() {
        const data = this.state.data;
        return <React.Fragment>
            <div id={this.outerName}>{data ? this.render_helper(data) : shared_vars.defaultLoading}</div>
            <PopUps popUps={this.state.popUps} />
        </React.Fragment>;
    };
};

export class PopUps_data {
    constructor() {
        this.children = [];
        
        this.clear = this.clear.bind(this);
        this.addPopUp = this.addPopUp.bind(this);
        this.push = this.push.bind(this);
        this.pop = this.pop.bind(this);
    };
    clear() {
        this.children = [];
        return this;
    };
    addPopUp(description) {
        this.children.push(<div id={description.id} className="popUp"><div>
            <h3>{description.title}</h3>
            <hr />
            <p>{shared_vars.intersperseWith(description.textLines || [], <br />)}</p>
            {description.btn && <button className="close" onClick={description.btn.onClick}>{description.btn.text}</button>}
        </div></div>);
        return this;
    };
    push(e) {
        this.children.push(e);
        return this;
    };
    pop() {
        return this.children.pop();
    };
};

export const waitingPopUp = <div className="popUp"><div>
    <h3>Waiting</h3>
    <hr />
    <p>This won't take too long, I hope!</p>
</div></div>;

export function PopUps(props) {
    return <div id="popUps" style={props.style}>{props.popUps.children}</div>;
};

export function Board(props) {
    return <table id="board" style={props.style}>
        <tr className="edge">
            <th className="edge"></th>
            <th className="edge">A</th>
            <th className="edge">B</th>
            <th className="edge">C</th>
            <th className="edge">D</th>
            <th className="edge">E</th>
            <th className="edge">F</th>
            <th className="edge">G</th>
        </tr>
        {["1","2","3","4","5","6","7"].map(col => (
            <tr className="edge">
                <th className="edge">{col}</th>
                {["A","B","C","D","E","F","G"].map(row => (
                    <td id={row+col} className="square" style={{backgroundColor:(props.done.includes(row+col)?"#CC6600":"white")}}></td>
                ))}
            </tr>
        ))}
    </table>;
};

export function CurrentSquare(props) {
    return <div className="currentSquare" style={props.style}>
        <h2>Current Square: {props.square}</h2>
    </div>;
};

const listStyle = {minHeight: '70px', maxHeight: '-webkit-fill-available', background: '#fff', 
                   overflow: 'auto', border: 'solid black 3px', borderRadius: '10px',
                   listStyleType: 'none', margin: 0, padding: 0};

export class List_data {
    constructor(initial) {
        this.elems = initial || [];
    };
    push(e) {
        this.elems.unshift(e); // pushes to front
        return this;
    };
    remove(e) {
        shared_vars.removeFirstOccurrenceIn(e, this.elems);
        return this;
    };
};

export function NiceList(props) {
    return <ul style={props.style}>
        {props.elems.map((e, pos) => (
            <li style={{position:'relative', padding: '5px 10px'}}>
                {props.callback && <div style={{display: 'inline-block', float: 'right', fontSize: '40px', fontWeight: 'bold', padding: '10px', cursor: 'pointer',
                                                position: 'absolute', right: 0, top: '-21px'}} onClick={() => props.callback(e, pos)}>&times;</div>}
                <div style={{background: ((pos % 2) ? '#eee' : '#fff'), width: 'calc(100% - 30px)', overflowWrap: 'break-word'}}>{e}</div>
            </li>
        ))}
    </ul>;
};
