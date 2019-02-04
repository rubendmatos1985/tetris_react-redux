import React, { useEffect } from "react";
import { connect } from "react-redux";
import Rect from "./active-rect";

import FigureContainer from "./figure-container";

const CurrentFigure = props => {
  useArenaToLaunchGameOver(props);
  useLandedStatusToLaunchFigure(props);
  useGameOverStatusToMoveFigureDown(
    props.staticData.gameOver,
    props.dispatch,
    props.currentFigure.frame
  );
  return (
    <FigureContainer>
      {props.staticData.matrices[props.currentFigure.figureType][
        props.currentFigure.figureInversion
      ].map((subArr, idxY) =>
        subArr.map((num, idxX) =>
          num > 0 ? (
            <Rect
              key={idxX}
              x={props.currentFigure.xPosition * 25 + idxX * 25}
              y={props.currentFigure.yPosition + idxY * 25}
              fill={  props.staticData.colors[props.currentFigure.figureType].color} 
              stroke={ 1 }/> 
          ) : null
        )
      )}
    </FigureContainer>
  );
};

const useLandedStatusToLaunchFigure = props =>
  useEffect(() => {
    if (props.currentFigure.landed && !props.staticData.gameOver)
      props.dispatch({ type: "LAUNCH_NEW_FIGURE" });
  }, [props.currentFigure.landed, props.staticData.gameOver]);

const useArenaToLaunchGameOver = props =>
  useEffect(() => {
    props.staticData.arena[4].map(num =>
      num > 0 ? props.dispatch({ type: "GAME_OVER" }) : null
    );
  }, [props.staticData.arena[4]]);
const useGameOverStatusToMoveFigureDown = (gameOverStatus, dispatch, frame) =>
  useEffect(() => {
    if (!gameOverStatus) dispatch({ type: "MOVE_FIGURE_DOWN" });
  }, [frame]);

const mapState = state => ({ ...state });
export default connect(mapState)(CurrentFigure);
