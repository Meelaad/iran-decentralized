import React from 'react';
import DecentralizedGovArchitecture from './DecentralizedGovArchitecture';

function App() {
    return (
        // remove any default padding/margins so the dark background fills the whole screen
        <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
            <DecentralizedGovArchitecture />
        </div>
    );
}

export default App;