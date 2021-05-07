import { Layout } from 'antd';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <Layout>
      <Header />
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
};

export default MainLayout;
