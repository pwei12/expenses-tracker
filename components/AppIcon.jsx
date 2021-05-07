import styled from 'styled-components';

const Icon = styled.div`
  position: relative;
  background-color: greenyellow;
  height: 18px;
  width: 12px;
  color: white;
  border-radius: 0 50%;
  :before {
    content: '';
    position: absolute;
    height: 18px;
    width: 12px;
    background-color: magenta;
    border-radius: 0 50%;
    bottom: 2px;
    left: 6px;
    transform: rotate(30deg);
  }
  :after {
    content: '';
    position: absolute;
    height: 18px;
    width: 12px;
    background-color: gold;
    border-radius: 0 50%;
    left: 12px;
    top: 2px;
    transform: rotate(80deg);
  }
`;

const AppIcon = () => {
  return <Icon />;
};

export default AppIcon;
