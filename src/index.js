import React from "react";
import { render } from "react-dom";
import Arena from "./arena";
import { Provider } from "react-redux";
import store from "./store";
import CurrentFigure from "./currentFigure";
import Canvas from "./canvas-container";
import styled from "styled-components";
import ScoreAndRecord from "./aside";
import Audio from './audio'

/* if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  } */

const AppContainer = styled.div`
  width: 85vw;
  height: 85vh;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
`;

const App = () => (
  <AppContainer>
    <Canvas>
      <Arena />
      <CurrentFigure />
    </Canvas>
    <Audio/>
    <ScoreAndRecord background='#422619'/>

  </AppContainer>
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
