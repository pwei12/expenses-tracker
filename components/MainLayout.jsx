import { Layout } from 'antd';
import Header from './Header';

const MainLayout = ({ children, hasLoggedIn, hasAuthButton }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header hasLoggedIn={hasLoggedIn} hasAuthButton={hasAuthButton} />
      <Layout.Content style={{ padding: '24px' }}>{children}</Layout.Content>
    </Layout>
  );
};

export default MainLayout;
