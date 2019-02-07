import React, { useLayoutEffect, useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
const R = require("ramda");

const Group = styled.g`
  fill: "pink";
  stroke: "black";
  stroke-width: 1px;
`;

const FigureContainer = props => {
  //CHECK LANDING
  useLandedOrCollisionedStatus(
    LandDetector(props.children, props.arena),
    coordenatesAtLanded(props.children, props.arena),
    props
  );
  //CHECK COLLISION
  useLandedOrCollisionedStatus(
    collisionDownDetector(props.children, props.arena),
    coordenatesAtCollisionDown(props.children, props.arena),
    props
  );

  //CHECK IF AFTER FIGURE INVERSION
  //THE FIGURE IT'S OUT OF THE CANVAS
  //AND MOVING IT LEFT OR RIGHT
  useCheckIfFigureIsOutOfCanvas(
    props.children,
    props.canvasWidth,
    props.dispatch
  );

  // MOVE LEFT OR RIGHT AND INVERT FIGURE

  useKeyDownActions(
    collisionLeftDetector(props.children, props.arena),
    collisionRightDetector(props.children, props.arena),
    props
  );

  return <Group>{props.children}</Group>;
};

/*_______________________  ------>    HELPER FUNCTIONS  <-------  _______________________ */

/*_______----> SIDE EFFECTS FUNCTIONS <---_______*/

// CHECK IF FIGURE IS LANDED

const useLandedOrCollisionedStatus = (status, figureCoordenates, props) =>
  useEffect(() => {
    if (status) {
      props.dispatch({
        type: "COLLISION",
        payload: {
          where: "down",
          y: figureCoordenates.y,
          x: figureCoordenates.x,
          children: figureCoordenates.children,
          figureType: props.figureType,
          figureInversion: props.figureInversion
        }
      });
    }
  }, [status]);

const useKeyDownActions = (collisionLeft, collisionRight, props) => {
  const handleDispatchLeftAndRightArrows = (
    event,
    action = "",
    dispatch = props.dispatch
  ) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch({ type: action });
  };

  // KEY DOWN EVENT HANDLER

  const handleKeyDown = event => {
    if (event.key === "ArrowLeft" && !collisionLeft && !props.landed) {
      handleDispatchLeftAndRightArrows(event, "MOVE_ITEM_LEFT");
    }
    if (event.key === "ArrowRight" && !collisionRight && !props.landed) {
      handleDispatchLeftAndRightArrows(event, "MOVE_ITEM_RIGHT");
    }
    if (event.key === "ArrowUp" && !props.landed) {
      event.preventDefault();
      event.stopPropagation();

      // GIVES TRUE IF FIGURE OVERLAP
      // AND IF IS POSSIBLE TO
      // MOVE TO THE RIGHT
      // BEFORE INVERT

      const booleanToMoveRight = [
        nextInversionWillOverlap(props),
        ifOverlapMayIMoveRight(props)
      ].every(el => el);

      // GIVES TRUE IF FIGURE OVERLAP
      // AND IF IS POSSIBLE TO
      // MOVE TO THE LEFT
      // BEFORE INVERT

      const booleanToMoveLeft = [
        nextInversionWillOverlap(props),
        ifOverlapMayIMoveLeft(props)
      ].every(el => el);

      // THE FIGURE CAN BE INVERTED
      const noOverlaping = !nextInversionWillOverlap(props);

      // SIDE EFFECT FUNCTIONS
      //IF CONDITION DISPATCH ACTION TO REDUCER

      const ifOverlapDispatchMoveRightAndInvert = (cond, dispatch) =>
        cond &&
        dispatch(dispatch => {
          dispatch({ type: "MOVE_ITEM_RIGHT" });
          dispatch({
            type: "INVERT_FIGURE",
            payload: { matrixLength: Object.keys(props.currentMatrix).length }
          });
        });
      const ifOverlapDispatchMoveLeftAndInvert = (cond, dispatch) =>
        cond &&
        dispatch(dispatch => {
          dispatch({ type: "MOVE_ITEM_LEFT" });
          dispatch({
            type: "INVERT_FIGURE",
            payload: { matrixLength: Object.keys(props.currentMatrix).length }
          });
        });
      const ifNoOverlapDispatchInvert = (cond, dispatch) =>
        cond &&
        dispatch({
          type: "INVERT_FIGURE",
          payload: { matrixLength: Object.keys(props.currentMatrix).length }
        });

      //----------------------------------------------------------------------

      ifOverlapDispatchMoveRightAndInvert(booleanToMoveRight, props.dispatch);
      ifOverlapDispatchMoveLeftAndInvert(booleanToMoveLeft, props.dispatch);
      ifNoOverlapDispatchInvert(noOverlaping, props.dispatch);
    }
  };
  useLayoutEffect(() => {
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });
};

const useCheckIfFigureIsOutOfCanvas = (children, canvasWidth, dispatch) => {
  useEffect(() => {
    if (figureIsOutOfCanvas(children, canvasWidth).left)
      dispatch({ type: "MOVE_ITEM_RIGHT" });
    if (figureIsOutOfCanvas(children, canvasWidth).right)
      dispatch({ type: "MOVE_ITEM_LEFT" });
  }, [children]);
};

/*-------------------------------------------------------     PURE  FUNCTIONS   ----------------------------------------------------------------------------------*/

// TAKE THE NEXT FIGURE INVERSION
// AND CHECK IF WILL OVERLAP ANY FIGURE IN ARENA

const ifOverlapMayIMoveLeft = props =>
  R.compose(
    mayNextInversionMoveLeft(props.arena),
    getNextPosition
  )(props);

// IF THERE IS AN OVRLAP DETECTED
// BEFORE INVERT THE FIGURE
// CHECK IF CAN BE MOVED TO
// RIGHT

const ifOverlapMayIMoveRight = props =>
  R.compose(
    mayNextInversionMoveRight(props.arena),
    getNextPosition
  )(props);

// IF THERE IS AN OVRLAP DETECTED
// BEFORE INVERT THE FIGURE
// CHECK IF CAN BE MOVED TO
// LEFT

const mayNextInversionMoveLeft = arena => nextPosition =>
  nextPosition.every(obj => arena[obj.y][obj.x - 1] === 0);

const mayNextInversionMoveRight = arena => nextPosition =>
  nextPosition.every(obj => arena[obj.y][obj.x + 1] === 0);

const nextInversionWillOverlap = props =>
  R.compose(
    someSquareOverlapInArena(props.arena),
    getNextPosition
  )(props);

const someSquareOverlapInArena = arena => nextPosition =>
  nextPosition.some(obj => arena[obj.y][obj.x] > 0);

const getNextPosition = props =>
  R.compose(
    arrayWithoutNull,
    nextPositionWithCoordenates(props.xPosition, props.yPosition),
    nextFigurePosition(props.currentMatrix)
  )(props.figureInversion);

// IT GIVES THE NEXT INVERSION OF THE FIGURE
// USEFUL TO CALCULATE AND PREVENT OVERLAPINGS  
const nextFigurePosition = currentMatrix => figureInversion =>
  currentMatrix[figureInversion + 1]
    ? currentMatrix[figureInversion + 1]
    : currentMatrix[0];

// IT GIVES THE COORDENATES OF THE NEXT FIGURE INVERSION
const nextPositionWithCoordenates = (
  currentXPosition,
  currentYPosition
) => figure =>
  figure.map((arr, yIndex) =>
    arr.map((num, xIndex) =>
      num > 0
        ? { x: currentXPosition + xIndex, y: currentYPosition / 25 + yIndex }
        : null
    )
  );

/*----> COLLISION DOWN <----*/

const coordenatesAtLanded = (children, arena) =>
  R.compose(
    figureCoordenates(children),
    ifArrayLength,
    figureLanded(arena),
    arrayWithoutNull
  )(children);

const coordenatesAtCollisionDown = (children, arena) =>
  R.compose(
    figureCoordenates(children),
    ifArrayLength,
    figureBellow(arena),
    arrayWithoutNull
  )(children);

const LandDetector = (children, arena) =>
  R.compose(
    ifArrayLength,
    figureLanded(arena),
    arrayWithoutNull
  )(children);

const collisionDownDetector = (children, arena) =>
  R.compose(
    ifArrayLength,
    figureBellow(arena),
    arrayWithoutNull
  )(children);

// CHECK IF THERE IS A FIGURE BELLOW THE FIGURE
const figureBellow = arena => children =>
  children
    .map(item =>
      item.props.y / 25 + 1 < arena.length
        ? arena[item.props.y / 25 + 1][item.props.x / 25] > 0
          ? true
          : null
        : null
    )
    .filter(val => val);

// CHECK IF FIGURE LANDED

const figureLanded = arena => children => {
  const lowestSquare = children.reduce((acc, obj) =>
    acc.y > obj.y ? acc : obj
  );
  if (lowestSquare.props.y / 25 === 19) return [lowestSquare];
  else return [];
};

//AFTER COLLISION DOWN OR LANDED
//SEND THE EXACT COORDENATES TO THE
//REDUCER TO DRAW IN THE MATRIX

const figureCoordenates = children => collisionDown => {
  if (collisionDown) {
    // Y AXIS TO START DRAWING IN MATRIX
    const y = children
      .reduce((acc, obj) => acc.concat(obj))
      .filter(val => val)
      .reduce((acc, obj) => (acc.props.y < obj.props.y ? acc : obj));
    // X AXIS TO START DRAWING IN MATRIX
    const x = children
      .reduce((acc, obj) => acc.concat(obj))
      .filter(val => val)
      .reduce((acc, obj) => (acc.props.x < obj.props.x ? acc : obj));
    return {
      y: y.props.y / 25,
      x: x.props.x / 25,
      children
    };
  } else return;
};

// COLLISION RIGHT

const collisionRightDetector = (children, arena) =>
  R.compose(
    ifArrayLength,
    collisionAtRight(arena),
    mostAtright
  )(children);

const collisionAtRight = arena => children =>
  children.filter(
    sq => arena[sq.y][sq.x + 1] > 0 || arena[sq.y][sq.x + 1] === undefined
  );

//FILTER THE FIGURES MOST AT RIGHT

const mostAtright = children =>
  children
    .map(arr => arr.filter(val => val))
    .filter(arr => arr.length > 0)
    .map(arr => arr.reduce((acc, sq) => (acc.props.x > sq.props.x ? acc : sq)))
    .map(el => (el ? { x: el.props.x / 25, y: el.props.y / 25 } : {}))
    .filter(el => Object.keys(el).length > 0);

//COLLISION LEFT
const collisionLeftDetector = (children, arena) =>
  R.compose(
    ifArrayLength,
    collisionAtLeft(arena),
    mostAtLeft
  )(children);

const ifArrayLength = arr => arr.length > 0 && arr[0] !== null;

const collisionAtLeft = arena => children =>
  children.filter(
    sq => arena[sq.y][sq.x - 1] > 0 || arena[sq.y][sq.x - 1] === undefined
  );

const mostAtLeft = children =>
  children
    .map(arr => arr.filter(val => val))
    .filter(arr => arr.length > 0)
    .map(arr => arr.reduce((acc, sq) => (acc.props.x < sq.props.x ? acc : sq)))
    .map(el => (el ? { x: el.props.x / 25, y: el.props.y / 25 } : {}))
    .filter(el => Object.keys(el).length > 0);

/* FIGURE INVERSION   */

// CHECK IF X AXIS IS MINOR THAN 0
// OR GREATER THAN CANVAS WIDTH
// IT WOULD MEAN THE FIGURE IS OUT OF CANVAS

const figureIsOutOfCanvas = (children, canvasWidth) =>
  R.compose(
    xAxisIsGreaterThanWidth(canvasWidth),
    xAxisIsNegative,
    arrayWithoutNull
  )(children);

const xAxisIsNegative = children => ({
  children,
  xAxisIsNegative: children.some(obj => obj.props.x < 0)
});

const xAxisIsGreaterThanWidth = canvasWidth => obj => ({
  left: obj.xAxisIsNegative,
  right: obj.children.some(ch => ch.props.x >= canvasWidth)
});

//REMOVE VALUE NULL FROM THE ARRAY OF CHILDREN

const arrayWithoutNull = children =>
  children
    .map(arr => arr.filter(obj => obj !== null))
    .filter(arr => arr.length > 0)
    .reduce((arr, acc) => arr.concat(acc), []);

/**------->  MAP STATE TO PROPS <------- */

const mapState = state => ({
  figureType: state.currentFigure.figureType,
  figureInversion: state.currentFigure.figureInversion,
  landed: state.currentFigure.landed,
  arena: state.staticData.arena,
  currentMatrix: state.staticData.matrices[state.currentFigure.figureType],
  canvasWidth: state.staticData.canvas.width,
  xPosition: state.currentFigure.xPosition,
  yPosition: state.currentFigure.yPosition,
  frame: state.currentFigure.frame,
  rightCounter: state.currentFigure.rightCounter
});

export default connect(mapState)(FigureContainer);
