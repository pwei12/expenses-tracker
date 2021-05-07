import { parse } from 'cookie';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';

export const getServerSideProps = context => {
  const cookies = parse(context.req.headers?.cookie ?? '');
  const hasLoggedIn = Boolean(cookies[COOKIE_NAME]);
  return hasLoggedIn
    ? {
        props: {
          hasLoggedIn
        }
      }
    : {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
};

const ExpensesPage = ({ hasLoggedIn }) => {
  return (
    <MainLayout hasLoggedIn={hasLoggedIn} hasAuthButton={hasLoggedIn}>
      Placeholder
    </MainLayout>
  );
};

export default ExpensesPage;
