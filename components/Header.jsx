import { Grid, Layout, Typography } from 'antd';
import Link from 'next/link';
import AppIcon from './AppIcon';

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
        <AppIcon />
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
