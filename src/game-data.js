import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-width: 80%;
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  top: 1%;
  height: 129px;
  background: ${props => props.background};
  box-shadow: 0px 2px 10px ${props => props.background};
`;

const GameInfo = styled.div`
  width: 100%;
  font-size: 30px;
  text-align: center;
`;

const GameData = ({  background, record, score }) => (
  <Container background = {background}>
    <GameInfo>
      Record:  {record}
    </GameInfo>
    <GameInfo>
      Score: { score }
    </GameInfo>
    
  </Container>
);

export default GameData;
