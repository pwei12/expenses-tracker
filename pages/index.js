import Head from 'next/head';
import { parse } from 'cookie';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';
import { Col, Row, Typography } from 'antd';
import Link from 'next/link';
import RoundCornerButton from '../components/RoundCornerButton';
import { Pie } from 'react-chartjs-2';
import {
  EXPENSE_CATEGORIES,
  PIE_CHART_COLORS,
  PIE_CHART_HOVER_COLORS
} from '@/constants/expense';
import { EXPENSES_API_ROUTE } from '@/constants/route';
import { getRequest } from '@/utils/apiCall';
import { sumUpExpenses } from '@/utils/expense';
import jwt from 'jsonwebtoken';

export const getServerSideProps = async context => {
  const headersCookie = context.req.headers?.cookie ?? '';
  const cookies = parse(headersCookie);
  const hasLoggedIn = Boolean(cookies[COOKIE_NAME]);
  let userName = '';
  if (hasLoggedIn) {
    userName =
      jwt.verify(cookies[COOKIE_NAME], process.env.JWT_SECRET)?.userName ??
      null;
  }

  const getExpensesResponse = await getRequest(
    `${process.env.DOMAIN}${EXPENSES_API_ROUTE}`,
    headersCookie
  );

  return {
    props: {
      hasLoggedIn,
      expenses:
        getExpensesResponse.success && hasLoggedIn
          ? getExpensesResponse.data
          : [],
      userName
    }
  };
};

export default function Home({ hasLoggedIn, expenses, userName }) {
  const redirectUrl = hasLoggedIn ? '/expenses' : '/login';
  const buttonLabel = !hasLoggedIn
    ? 'Get Started'
    : expenses.length > 0
    ? 'View List'
    : 'Add Expenses';

  const expensesByCategory = EXPENSE_CATEGORIES.map(category => {
    return sumUpExpenses(expenses.filter(item => item.category === category));
  });
  const pieChartData = {
    labels: EXPENSE_CATEGORIES,
    datasets: [
      {
        data: expensesByCategory,
        backgroundColor: PIE_CHART_COLORS,
        hoverBackgroundColor: PIE_CHART_HOVER_COLORS
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Expenses Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout hasLoggedIn={hasLoggedIn} hasAuthButton={true}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            {hasLoggedIn
              ? `Hi ${userName ?? ''}`
              : ' Track your expenses everyday'}
          </Typography.Title>{' '}
        </div>

        {expenses.length > 0 ? (
          <Row justify="center">
            <Col lg={6}>
              <Pie data={pieChartData} />
            </Col>
          </Row>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '32px'
          }}
        >
          <Link href={redirectUrl}>
            <a>
              <RoundCornerButton
                type="primary"
                style={{ backgroundColor: '#001628', height: '40px' }}
              >
                {buttonLabel}
              </RoundCornerButton>
            </a>
          </Link>
        </div>
      </MainLayout>
    </>
  );
}
