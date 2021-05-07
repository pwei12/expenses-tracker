import styled from 'styled-components';

const Icon = styled.div`
  position: relative;
  background-color: greenyellow;
  height: 16px;
  width: 14px;
  color: white;
  border-radius: 0 50%;
  :after {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    background-color: gold;
    border-radius: 0 50%;
    left: 7px;
    transform: rotate(90deg);
  }
`;

const AppIcon = () => {
  return <Icon />;
};

export default AppIcon;
