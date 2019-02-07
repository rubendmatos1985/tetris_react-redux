import React from "react";
import Modal from "./modal";
import { connect } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  display: ${props => (props.show ? "flex" : "none")};
  flex-direction: column;
  background: rgba(0, 32, 28, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  background: #fc0367;
  font-size: 5vw;
  color: #03cafc;
  width: 50vw;
  height: 30vh;
  text-shadow: 7px 6px 12px #000000;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 30vw;
  height: 10vw;
  font-size: 5vw;
  color: #fc0367;
  background: #03cafc;
  border: none;
`;

const GameOver = props => {
  const startGame = ()=>(
    props.dispatch({  type: 'RESTART_GAME' })
  );
  return (
    <Modal>
      <Container show={props.gameOver}>
        <Text>GAME OVER</Text>
        <Button onClick={ startGame } > Try Again </Button>
      </Container>
    </Modal>
  );
};

const mapState = ({ staticData }) => ({ gameOver: staticData.gameOver });

export default connect(mapState)(GameOver);
