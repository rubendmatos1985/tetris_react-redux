import styled from 'styled-components';

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

export default Container;