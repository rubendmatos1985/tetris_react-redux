import React from "react";
import Modal from "./modal";
import { connect } from "react-redux";
import Container from './container-for-modal';
import styled from "styled-components";

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
