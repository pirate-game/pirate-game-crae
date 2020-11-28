import React from 'react';

import shared_vars from './shared_vars';

export default () => (
<div className="sometext" style={{backgroundColor:"lightblue"}}>
    <React.Suspense fallback={shared_vars.defaultLoading}>
        <p>Hello!</p>
        //Must be a class, to allow update upon change of theme
    </React.Suspense>
</div>
);
