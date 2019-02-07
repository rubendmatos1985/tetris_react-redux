import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import GameData from './game-data';
const Container = styled.aside`
  width: 20vw;
  height: 100%;
  background: ${ props => props.background };
  font-size:  2.5vw;
  color: white;
  margin-left: 20px;
  margin-bottom: 2%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const Aside = ({ score, record, background }) => (
  <Container background={ background } >
    <GameData name="Score" data={score} />
    <GameData name="Record" data={record} />
  </Container>
);

const mapState = ({ staticData }) => ({
  score: staticData.score,
  record: staticData.record
});
export default connect(mapState)(Aside);
