import { Col, Row } from 'antd';

const CenterWrapper = ({ children }) => {
  return (
    <Row justify="center" align="middle">
      <Col>{children}</Col>
    </Row>
  );
};

export default CenterWrapper;