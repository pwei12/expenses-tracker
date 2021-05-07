import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Col, Grid, Layout, message, Row, Typography } from 'antd';
import Link from 'next/link';
import AppIcon from './AppIcon';
import { LOGOUT_ROUTE } from '@/constants/route';
import { apiCall } from '@/utils/apiCall';

const SUCCESSFUL_LOGOUT_MESSAGE = 'You have been logged out';
const LOGOUT_ERROR_MESSAGE = 'Failed to logout';

const Header = ({ hasLoggedIn, hasAuthButton }) => {
  const router = useRouter();
  const breakpoint = Grid.useBreakpoint();
  const isMobile = breakpoint.xs || (breakpoint.sm && !breakpoint.md);

  const [hasLoggedOut, setHasLoggedOut] = useState(!hasLoggedIn);

  const handleButtonClick = async () => {
    if (hasLoggedIn) {
      const response = await apiCall(
        LOGOUT_ROUTE,
        {},
        () => setHasLoggedOut(true),
        () => message.error(LOGOUT_ERROR_MESSAGE)
      );

      if (response.success) {
        message.success(SUCCESSFUL_LOGOUT_MESSAGE);
        router.push({
          pathname: '/'
        });
      } else {
        setSubmitting(false);
        message.error(response.reason);
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <Layout.Header
      style={{
        color: 'white',
        fontSize: isMobile ? '16px' : '24px',
        padding: '0px 24px'
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        <Col span={12}>
          <Link href="/">
            <a>
              <Row align="middle" gutter={[24]}>
                <Col>
                  <AppIcon />
                </Col>
                <Col>
                  {isMobile ? null : (
                    <Typography.Title
                      level={4}
                      style={{
                        color: 'white',
                        margin: '0px 16px',
                        padding: '0px'
                      }}
                    >
                      Expenses Tracker
                    </Typography.Title>
                  )}
                </Col>
              </Row>
            </a>
          </Link>
        </Col>
        {hasAuthButton && (
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="ghost"
                onClick={handleButtonClick}
                style={{ color: 'white' }}
              >
                {hasLoggedIn && !hasLoggedOut ? 'Logout' : 'Login'}
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </Layout.Header>
  );
};

export default Header;
