import { Grid, Layout, Typography } from 'antd';
import styled from 'styled-components';
import Link from 'next/link';

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

const Header = () => {
  const breakpoint = Grid.useBreakpoint();
  const isMobile = breakpoint.xs || (breakpoint.sm && !breakpoint.md);

  return (
    <Layout.Header
      style={{
        color: 'white',
        fontSize: isMobile ? '16px' : '24px',
        paddingLeft: '24px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Link href="/">
        <Icon />
      </Link>
      {isMobile ? null : (
        <Typography.Title
          level={4}
          style={{ color: 'white', margin: '0px 16px', padding: '0px' }}
        >
          Expenses Tracker
        </Typography.Title>
      )}
    </Layout.Header>
  );
};

export default Header;
