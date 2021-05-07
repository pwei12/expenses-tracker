import { Col, Form, Input, message, Row, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { formRules } from '@/utils/formRules';
import { hashPassword } from '@/utils/auth';
import { apiCall } from '@/utils/apiCall';
import { LOGIN_ROUTE, EXPENSES_ROUTE } from '@/constants/route';
import { COOKIE_NAME } from '@/constants/auth';
import CenterWrapper from '../components/CenterWrapper';
import RoundCornerButton from '../components/RoundCornerButton';

const SUCCESSFUL_LOGIN_MESSAGE = 'Login successfully';
const LOGIN_ERROR_MESSAGE = 'Failed to login. Please try again';

export const getServerSideProps = context => {
  destroyCookie(context, COOKIE_NAME, '/');
  return { props: {} };
};

const LoginPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = useCallback(
    async formValue => {
      setSubmitting(true);
      const { email, password } = formValue;
      const payload = {
        email,
        password: hashPassword(password)
      };

      const response = await apiCall(
        LOGIN_ROUTE,
        payload,
        () => setSubmitting(false),
        () => message.error(LOGIN_ERROR_MESSAGE)
      );

      if (response.success) {
        message.success(SUCCESSFUL_LOGIN_MESSAGE);
        setSubmitting(false);
        router.push({
          pathname: EXPENSES_ROUTE
        });
      } else {
        setSubmitting(false);
        message.error(response.reason);
      }
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Row
        justify="center"
        align="middle"
        style={{ padding: 24, height: '100vh' }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={16} md={12} lg={8} xl={7}>
          <CenterWrapper>
            <Typography.Title level={3}>Login</Typography.Title>
          </CenterWrapper>
          <Form
            form={form}
            onFinish={handleLogin}
            style={{ marginTop: 20 }}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[formRules.EMAIL_REQUIRED, formRules.EMAIL_FORMAT]}
            >
              <Input autoComplete="email" />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[formRules.LOGIN_PASSWORD_FORMAT]}
              >
                <Input.Password autoComplete="current-password" />
              </Form.Item>
            </Form.Item>
            <CenterWrapper>
              <RoundCornerButton
                loading={submitting}
                type="primary"
                htmlType="submit"
              >
                Submit
              </RoundCornerButton>
            </CenterWrapper>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default LoginPage;
