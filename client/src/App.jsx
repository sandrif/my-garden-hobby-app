import './App.css';
import React from 'react';
import { BrowserRouter , Routes, Route } from "react-router-dom";

import MainView from "./main-view";
import 'bootstrap/dist/css/bootstrap.min.css';
import PlantListProvider from "./plant-list-provider";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <PlantListProvider> 
          <Routes>
            <Route path="/" element={<MainView />} />
          </Routes>
        </PlantListProvider>
      </BrowserRouter>

    </div>
   
  );
}

export default App;
