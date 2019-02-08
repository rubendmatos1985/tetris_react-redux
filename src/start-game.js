import React, { useLayoutEffect } from "react";
import Modal from "./modal";
import Container from "./container-for-modal";
import { connect } from "react-redux";
import styled from "styled-components";

const Title = styled.div`
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 40px;
  color: blue;
  font-weight: bold;
`;

const Button = styled.button`
 padding:5px;
 width: 100px;
 outline: none;
 border: 1px solid #ff2865;
 color: #ff2865;
 font-size: 20px;
 transition: all 1s;
 background: transparent;
  :hover{
   cursor: pointer;
   background: #ff75a1;
   color: white;
}
   
`;

const StartGame = ({ dispatch, startGame }) => {
  const doStartGame = () => dispatch({ type: "START_GAME" });
  return (
    <Modal>
      <Container show={!startGame}>
        <Title>Welcome To Tetris</Title>
        <Button onClick={doStartGame}>Start</Button>
      </Container>
    </Modal>
  );
};

const mapState = ({ staticData }) => ({ startGame: staticData.startGame });

export default connect(mapState)(StartGame);
