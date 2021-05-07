import { Layout } from 'antd';
import Header from './Header';

const MainLayout = ({ children, hasLoggedIn, hasAuthButton }) => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Header hasLoggedIn={hasLoggedIn} hasAuthButton={hasAuthButton} />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};

export default MainLayout;
