import React from "react";
import { render } from "react-dom";
import Arena from "./arena";
import { Provider } from "react-redux";
import store from "./store";
import CurrentFigure from "./currentFigure";
import Canvas from "./canvas-container";
import styled from "styled-components";
import Audio from './audio';
import StartGame from './start-game';
import GameOver from './game-over';
import './style.css'
/* if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  } */

const GameContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #3d3c3c;
`;
const Container = styled.section`
 
 width: 100%;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
`;
const App = () => (
  <Container>
  <GameContainer>
    <Canvas>
      <Arena />
      <CurrentFigure />
    </Canvas>
    <Audio/>
   <StartGame/>
   <GameOver/>
  </GameContainer>
  </Container>
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
