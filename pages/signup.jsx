import { Col, Form, Input, message, Row, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { formRules } from '@/utils/formRules';
import { hashPassword } from '@/utils/auth';
import { postRequest } from '@/utils/apiCall';
import { SIGNUP_API_ROUTE, HOME_ROUTE } from '@/constants/route';
import CenterWrapper from '../components/CenterWrapper';
import RoundCornerButton from '../components/RoundCornerButton';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';
import Link from 'next/link';

const SUCCESSFUL_SIGNUP_MESSAGE = 'Signup completed';

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
      try {
        const response = await postRequest(SIGNUP_API_ROUTE, payload);
        if (response.success) {
          message.success(SUCCESSFUL_SIGNUP_MESSAGE);
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
        <title>Sign Up</title>
      </Head>
      <MainLayout hasLoggedIn={false} hasAuthButton={false}>
        <Row
          justify="center"
          align="middle"
          style={{
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
                rules={[
                  formRules.CONFIRM_PASSWORD_REQUIRED,
                  formRules.PASSWORD_MATCH
                ]}
              >
                <Input.Password />
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
              <Link href="/login">Log in here</Link>
              <span>&nbsp;if already have an account</span>
            </CenterWrapper>
          </Col>
        </Row>
      </MainLayout>
    </>
  );
};

export default SignupPage;
