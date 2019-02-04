import React, { useLayoutEffect, useRef } from "react";
import { connect } from "react-redux";

const Audio = ({ gameOver }) => {
  const audio = useRef();
  useLayoutEffect(() => {
    if (gameOver) {
      audio.current.play();
    }
    if (!gameOver) {
      audio.current.pause();
    }
  }, [gameOver]);

  return (
    <audio
      ref={audio}
      src="https://ia800504.us.archive.org/33/items/TetrisThemeMusic/Tetris.ogg"
    />
  );
};

const mapState = ({ staticData }) => ({ gameOver: staticData.gameOver });

export default connect(mapState)(Audio);
