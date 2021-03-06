import React, {  useEffect, useRef } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import GameData from './game-data';

const SVG = styled.svg`
  width: ${ props => props.width };
  height: ${ props => props.height };
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const GameContainer = ({
  dispatch,
  arena,
  gameOver,
  children,
  landed,
  score,
  currentFigureColor,
  width,
  height,
  record,
  startGame
}) => {
  const landedAudio = useRef();
  const scoreAudio = useRef();
  useAnimationFrame(dispatch, gameOver, startGame);
  useScoreStatus(arena, dispatch);
  useConditionToMakeSound(landed, landedAudio);
  useConditionToMakeSound(score, scoreAudio);
  return (
    <Container>
      <GameData 
        background={ currentFigureColor } 
        record={ record }
        score = { score } 
        />
      <SVG
      width={ width }
      height={ height }
      >
      {children}
      
      </SVG>
      <audio
        ref={landedAudio}
        src="https://sampleswap.org/samples-ghost/SFX%20and%20UNUSUAL%20SOUNDS/bleeps%20blips%20blonks%20blarts%20and%20zaps/49[kb]smatter4-zap.aif.mp3"
      />
      <audio
        ref={scoreAudio}
        src="https://sampleswap.org/samples-ghost/SFX%20and%20UNUSUAL%20SOUNDS/SOUND%20FX%20CHEESY%20LO-FI/38[kb]Charge-Fanfare.aif.mp3"
      />
    </Container>
  );
};

/*--------------------->  HELPER FUNCTIONS <------------------------------------ */

const useAnimationFrame = (dispatch, gameOver, startGame) => {
  let stopId;
  const loop = t1 => t2 => {
    if (t2 - t1 > 450 && !gameOver) {
      dispatch({ type: "ADD_STEP" });
      stopId = window.requestAnimationFrame(loop(t2));
      if (gameOver) {
        window.cancelAnimationFrame(stopId);
      }
    } else {
      stopId = window.requestAnimationFrame(loop(t1));
    }
  };
  useEffect(() => {
    if(startGame) stopId = window.requestAnimationFrame(loop(0));
    return () => window.cancelAnimationFrame(stopId);
  }, [gameOver, startGame]);
};

const useScoreStatus = (arena, dispatch) => {
  const searchScores = arena =>
    arena
      .map((arr, index) => (arr.every(val => val > 0) ? index : null))
      .filter(val => val);
  useEffect(() => {
    if (searchScores(arena).length > 0) {
      dispatch({ type: "SCORE", payload: searchScores(arena) })
      }
    }, [arena]);
};

const useConditionToMakeSound = (condition, audio) =>
  useEffect(() => {
    if (condition) {
      audio.current.play();
    }
  }, [condition]);

const mapState = state => ({
  arena: state.staticData.arena,
  gameOver: state.staticData.gameOver,
  landed: state.currentFigure.landed,
  score: state.staticData.score,
  record: state.staticData.record,
  currentFigureColor: state.staticData.colors[state.currentFigure.figureType].color,
  scoreAnimationStarted: state.cssProperties.figuresInArena.scoreAnimationStarted,
  width: state.staticData.canvas.width,
  height: state.staticData.canvas.height,
  startGame: state.staticData.startGame
});

export default connect(mapState)(GameContainer);
