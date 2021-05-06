import { Button } from 'antd';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  border-radius: 5px;
`;

const RoundCornerButton = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default RoundCornerButton;
