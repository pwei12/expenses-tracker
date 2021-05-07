import { Col, Row } from 'antd';

const CenterWrapper = ({ children, style }) => {
  return (
    <Row justify="center" align="middle" style={{ ...style }}>
      <Col>{children}</Col>
    </Row>
  );
};

export default CenterWrapper;
