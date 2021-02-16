import React from 'react';

function getError() {
    const pos = window.location.href.location("error=");
    if (pos === -1) return false;
    const end = window.location.href.location("&", pos); // starts from pos
    if (end === -1) return window.location.href.slice(pos + 6); // rest of string
    return window.location.href.slice(pos + 6, end); // rest of string up to end
};

export default class Submitted extends React.Component {
    render() {
        return <div className="sometext">
            <p>{getError() || "Thank you! Form submitted. Hopefully your form made it to us."}</p>
        </div>;
    };
};
