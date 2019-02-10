import React, { useLayoutEffect, useState } from "react";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";
const R = require("ramda");

const animatedFill = keyframes`
  from {
    fill:  white
  }
  to{
    fill: ${props => props.fill}
  }

`;

const Rect = styled.rect.attrs(props => ({
  x: props.x,
  y: props.y
}))`
  width: 25px;
  height: 25px;
  fill: ${props => props.fill};
  animation: ${animatedFill} 3s linear;
  stroke: ${props => (props.withStrokes ? "black" : "none")};
  stroke-width: 1px;
  transition: all 0.3s 0.3s;
`;

const Arena = ({ colors, arena }) => {
  return (
    <g>
      {arena.map((subArr, idxY) =>
        subArr.map((val, idxX) =>
          val === 0 ? (
            <Rect
              className={`row-${idxY}`}
              key={idxX}
              x={idxX * 25}
              y={idxY * 25}
              fill="#05252b"
            />
          ) : (
            <Rect
              className={`row-${idxY}`}
              key={idxX}
              x={idxX * 25}
              y={idxY * 25}
              fill={colorPicker(colors, val)}
              withStrokes
            />
          )
        )
      )}
    </g>
  );
};

const colorPicker = (colors, value) => {
  const find = value => obj => obj.key === value;
  const key = R.compose(
    R.keys,
    R.filter(find(value))
  )(colors)[0];
  return colors[key].color;
};

const mapStateToProps = ({ staticData, currentFigure }) => ({
  colors: staticData.colors,
  figureType: currentFigure.figureType,
  arena: staticData.arena,
  landed: currentFigure.landed,
  score: staticData.score
});

export default connect(mapStateToProps)(Arena);
