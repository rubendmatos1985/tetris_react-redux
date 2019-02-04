import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';


const StyledRect = styled.rect`
 width: 25px;
 height: 25px;
 fill: ${ props=> props.fill };
 x: ${ props=>props.x };   
 y: ${ props=>props.y };
 stroke: black;
 stroke-width: ${ props=>props.stroke };
 
 `;

 


const Rect = ({x, y, fill, stroke})=>(
  <StyledRect 
  id="rect"
  x={x} y={y} fill={fill}
  stroke={ stroke }
  />
)
  




const mapState = ({ currentFigure, staticData })=>({ figureInformation: currentFigure, arena: staticData.arena })
export default connect(mapState)(Rect);