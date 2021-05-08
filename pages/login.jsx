import { Col, Form, Input, message, Row, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { formRules } from '@/utils/formRules';
import { hashPassword } from '@/utils/auth';
import { postRequest } from '@/utils/apiCall';
import { LOGIN_API_ROUTE, HOME_ROUTE } from '@/constants/route';
import { COOKIE_NAME } from '@/constants/auth';
import CenterWrapper from '../components/CenterWrapper';
import RoundCornerButton from '../components/RoundCornerButton';
import MainLayout from '../components/MainLayout';
import Link from 'next/link';

const SUCCESSFUL_LOGIN_MESSAGE = 'Login successfully';

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
      try {
        const response = await postRequest(LOGIN_API_ROUTE, payload);
        if (response.success) {
          message.success(SUCCESSFUL_LOGIN_MESSAGE);
          router.push({
            pathname: HOME_ROUTE
          });
        } else {
          throw response.reason;
        }
      } catch (error) {
        message.error(error);
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <MainLayout hasLoggedIn={false} hasAuthButton={false}>
        <Row
          justify="center"
          align="middle"
          style={{ height: '100%', width: '100%' }}
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
                  style={{ backgroundColor: '#064274', height: '40px' }}
                >
                  Submit
                </RoundCornerButton>
              </CenterWrapper>
            </Form>

            <CenterWrapper style={{ marginTop: '16px' }}>
              <Link href="/signup">Create an account</Link>
              <span>&nbsp;if don't have one yet</span>
            </CenterWrapper>
          </Col>
        </Row>
      </MainLayout>
    </>
  );
};

export default LoginPage;
