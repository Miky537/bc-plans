import React from 'react';
// import MapComponent from "./components/MapComponent/MapComponent";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponent/MapHolder";

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
