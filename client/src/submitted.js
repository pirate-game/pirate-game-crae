import React from 'react';

import * as shared_vars from './shared_vars';

export default class Submitted extends React.Component {
    render() {
        return <div className="sometext" style={{backgroundColor:"lightblue"}}>
            <p>Thank you! Form submitted. Hopefully your form made it to us.</p>
        </div>;
    };
};
