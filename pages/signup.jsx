import { Col, Form, Input, message, Row, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { formRules } from '@/utils/formRules';
import { hashPassword } from '@/utils/auth';
import { apiCall } from '@/utils/apiCall';
import { SIGNUP_ROUTE, EXPENSES_ROUTE } from '@/constants/route';
import CenterWrapper from '../components/CenterWrapper';
import RoundCornerButton from '../components/RoundCornerButton';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';
import Link from 'next/link';

const SUCCESSFUL_SIGNUP_MESSAGE = 'Signup completed';
const SIGNUP_ERROR_MESSAGE = 'Unexpected error. Please try again';

export const getServerSideProps = context => {
  destroyCookie(context, COOKIE_NAME, '/');
  return { props: {} };
};

const SignupPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = useCallback(
    async formValue => {
      setSubmitting(true);
      const { userName, email, password } = formValue;
      const hashedPassword = hashPassword(password);
      const payload = {
        userName,
        email,
        password: hashedPassword,
        confirmedPassword: hashedPassword
      };

      const response = await apiCall(
        SIGNUP_ROUTE,
        payload,
        () => setSubmitting(false),
        () => message.error(SIGNUP_ERROR_MESSAGE)
      );

      if (response.success) {
        message.success(SUCCESSFUL_SIGNUP_MESSAGE);
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
        <title>Sign Up</title>
      </Head>
      <MainLayout hasLoggedIn={false} hasAuthButton={false}>
        <Row
          justify="center"
          align="middle"
          style={{
            padding: 24,
            height: '100%',
            width: '100%'
          }}
        >
          <Col xs={24} sm={16} md={12} lg={8} xl={7}>
            <CenterWrapper>
              <Typography.Title level={3}>Signup an account</Typography.Title>
            </CenterWrapper>
            <Form
              form={form}
              onFinish={handleSignup}
              style={{ marginTop: 20 }}
              layout="vertical"
            >
              <Form.Item
                name="userName"
                label="Username"
                rules={[formRules.USERNAME_REQUIRED, formRules.USERNAME_FORMAT]}
              >
                <Input autoComplete="username" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[formRules.EMAIL_REQUIRED, formRules.EMAIL_FORMAT]}
              >
                <Input autoComplete={'email'} />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="password"
                label="Password"
                rules={[formRules.PASSWORD_REQUIRED, formRules.PASSWORD_FORMAT]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="confirmedPassword"
                label="Confirm Password"
                rules={[formRules.PASSWORD_REQUIRED, formRules.PASSWORD_MATCH]}
              >
                <Input.Password />
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

            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Link href="/login">Log in here</Link>
              <span>&nbsp; if already have an account</span>
            </div>
          </Col>
        </Row>
      </MainLayout>
    </>
  );
};

export default SignupPage;
