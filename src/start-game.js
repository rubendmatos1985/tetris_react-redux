import React, { useLayoutEffect } from "react";
import Modal from "./modal";
import { connect } from 'react-redux';

const StartGame = props => {
  const doStartGame = () => props.dispatch({ type: "START_GAME" });
  return (
    <Modal>
      <div>
        Wellcome To Tetris
        <button onClick={ doStartGame }>
          Click To Start Game
        </button>
      </div>
    </Modal>
  );
};

const mapState = ({ staticData })=>({startGame: staticData.startGame})

export default connect(mapState)(StartGame)
