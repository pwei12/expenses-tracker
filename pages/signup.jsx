import { Button, Col, Form, Input, message, Row, Typography } from 'antd';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { formRules } from '@/utils/formRules';
import { SIGNUP_ROUTE, EXPENSES_ROUTE } from '@/constants/route';
import { hashPassword } from '@/utils/auth';
import CenterWrapper from '../components/CenterWrapper';
import RoundCornerButton from '../components/RoundCornerButton';

const httpHeaders = {
  'Content-Type': 'application/json'
};
const HTTP_POST_METHOD = 'POST';
const SUCCESSFUL_SIGNUP_MESSAGE = 'Signup completed';
const SIGNUP_ERROR_MESSAGE = 'Unexpected error. Please try again';

const SignupPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = useCallback(
    async formValue => {
      const { userName, email, password } = formValue;
      try {
        setSubmitting(true);

        const hashedPassword = hashPassword(password);
        const response = await fetch(SIGNUP_ROUTE, {
          method: HTTP_POST_METHOD,
          headers: httpHeaders,
          body: JSON.stringify({
            userName,
            email,
            password: hashedPassword,
            confirmedPassword: hashedPassword
          })
        });

        if (response.ok) {
          message.success(SUCCESSFUL_SIGNUP_MESSAGE);
          router.push({
            pathname: EXPENSES_ROUTE
          });
        }
      } catch (error) {
        message.error(SIGNUP_ERROR_MESSAGE);
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
      <Row
        justify="center"
        align="middle"
        style={{ padding: 24 }}
        gutter={[16, 16]}
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
        </Col>
      </Row>
    </>
  );
};

export default SignupPage;
