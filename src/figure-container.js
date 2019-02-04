import React, { useLayoutEffect, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const Group = styled.g`
  fill: "pink";
  stroke: "black";
  stroke-width: 1px;
`;

const R = require("ramda");
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
  // MOVE LEFT OR RIGHT AND INVERT FIGURE IF IT IS POSSIBLE
  useKeyDownActions(
    collisionLeftDetector(props.children, props.arena),
    collisionRightDetector(props.children, props.arena),
    props.currentMatrix,
    props.dispatch,
    props.landed
  );
  return <Group>{props.children}</Group>;
};

/*_______________________  ------>    HELPER FUNCTIONS  <-------  _______________________ */

/*_______----> SIDE EFFECTS <---_______*/

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
const useKeyDownActions = (
  collisionLeft,
  collisionRight,
  currentMatrix,
  dispatch,
  landed
) => {
  const handleKeyDown = event => {
    if (event.key === "ArrowLeft" && !collisionLeft && !landed)
      dispatch({ type: "MOVE_ITEM_LEFT" });
    if (event.key === "ArrowRight" && !collisionRight && !landed)
      dispatch({ type: "MOVE_ITEM_RIGHT" });
    if (event.key === "ArrowUp" && !landed)
      dispatch({
        type: "INVERT_FIGURE",
        payload: { matrixLength: Object.keys(currentMatrix).length }
      });
  };
  useLayoutEffect(() => {
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [collisionLeft, collisionRight, currentMatrix, landed]);
};

/**   ---------------------------------------------------------------------------------    **/

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

const figureLanded = arena => children => {
  const lowestSquare = children.reduce((acc, obj) =>
    acc.y > obj.y ? acc : obj
  );
  if (lowestSquare.props.y / 25 === 19) return [lowestSquare];
  else return [];
};

const figureCoordenates = children => elementWhereCollisions => {
  if (elementWhereCollisions) {
    /* Y AXIS TO START DRAWING IN MATRIX */

    const y = children
      .reduce((acc, obj) => acc.concat(obj))
      .filter(val => val)
      .reduce((acc, obj) => (acc.props.y < obj.props.y ? acc : obj));

    /* X AXIS TO START DRAWING IN MATRIX */
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

/*-------> COLLISION RIGHT <------------*/

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

const mostAtright = children =>
  children
    .map(arr => arr.filter(val => val))
    .filter(arr => arr.length > 0)
    .map(arr => arr.reduce((acc, sq) => (acc.props.x > sq.props.x ? acc : sq)))
    .map(el => (el ? { x: el.props.x / 25, y: el.props.y / 25 } : {}))
    .filter(el => Object.keys(el).length > 0);

/*-------------------------------------------------------------------------------------------------------------------------------- */

/*------> COLLISION LEFT-----*/

const collisionLeftDetector = (children, arena) =>
  R.compose(
    ifArrayLength,
    ifThereIsOneAtLeft(arena),
    mostAtLeft
  )(children);

const ifArrayLength = arr => arr.length > 0 && arr[0] !== null;

const ifThereIsOneAtLeft = arena => children =>
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

/**-----------------------------------------------------------------------------------------------------------------------------------*/

/*-   REMOVE VALUE NULL FROM THE ARRAY   -*/

const arrayWithoutNull = children =>
  children
    .map(arr => arr.filter(obj => obj !== null))
    .filter(arr => arr.length > 0)
    .reduce((arr, acc) => arr.concat(acc), []);

/**------->  MAP STATE TO PROPS <------- */

const mapState = state => ({
  figureType: state.currentFigure.figureType,
  figureInversion: state.currentFigure.figureInversion,
  collisionLeft: state.currentFigure.collisionLeft,
  collisionRight: state.currentFigure.collisionRight,
  landed: state.currentFigure.landed,
  arena: state.staticData.arena,
  currentMatrix: state.staticData.matrices[state.currentFigure.figureType]
});

export default connect(mapState)(FigureContainer);
