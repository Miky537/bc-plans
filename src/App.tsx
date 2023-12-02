import React from 'react';
// import MapComponents from "./components/MapComponents/MapComponents";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponents/MapHolder";

function App() {
  return (
    <div className="App">
        <Main>
            <MapHolder />
        </Main>
    </div>
  );
}

export default App;
