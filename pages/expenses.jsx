import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parse } from 'cookie';
import { Button, Form, List, message, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getRequest, postRequest } from '@/utils/apiCall';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';
import { EXPENSES_API_ROUTE } from '@/constants/route';
import moment from 'moment-timezone';

const AddExpensesModal = dynamic(
  () => import('../components/AddExpensesModal'),
  {
    ssr: false
  }
);

const StyledButton = styled(Button)`
  border: none;
  background-color: transparent;
  color: #001628;
  :active,
  :focus {
    background-color: transparent;
    color: #035599;
    box-shadow: none;
    border: none;
  }
  :hover {
    background-color: transparent;
    color: #035599;
    box-shadow: 1px 1px 5px grey;
    border: none;
  }
`;

const SUCCESSFUL_ADD_EXPENSES_MESSAGE = 'Added expenses';

export const getServerSideProps = async context => {
  const cookies = parse(context.req.headers?.cookie ?? '');
  const hasLoggedIn = Boolean(cookies[COOKIE_NAME]);

  if (!hasLoggedIn) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  const response = await getRequest(
    `${process.env.domain}${EXPENSES_API_ROUTE}`
  );

  if (!response) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      hasLoggedIn,
      ssrExpenses: response.success ? response.data : {}
    }
  };
};

const ExpensesPage = ({ hasLoggedIn, ssrExpenses, error }) => {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setExpenses(ssrExpenses);
  }, [ssrExpenses]);

  useEffect(() => {
    if (!error) return;
    message.error(error);
  }, [error]);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddExpenses = async formValue => {
    setSubmitting(true);
    setIsModalVisible(false);
    const payload = {
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      date: moment.tz(formValue.date.utc(), moment.tz.guess()),
      notes: formValue.notes
    };
    try {
      const response = await postRequest(EXPENSES_API_ROUTE, payload);
      if (response.success) {
        message.success(SUCCESSFUL_ADD_EXPENSES_MESSAGE);
      } else {
        throw response.reason;
      }
    } catch (error) {
      message.error(error);
    } finally {
      setSubmitting(false);
      form.resetFields();
    }
  };

  const handleSelectCategory = category => {
    console.log('select category', category);
  };

  const handleSelectDate = date => {
    console.log('select date', date);
  };

  const formatDate = date => {
    return moment
      .tz(moment(date).utc(), moment.tz.guess())
      .format('D MMM yyyy');
  };

  return (
    <MainLayout hasLoggedIn={hasLoggedIn} hasAuthButton={hasLoggedIn}>
      <StyledButton
        icon={<PlusCircleOutlined style={{ fontSize: '24px' }} />}
        onClick={handleOpenModal}
      ></StyledButton>

      <AddExpensesModal
        form={form}
        isVisible={isModalVisible}
        onAddExpenses={handleAddExpenses}
        onSelectCategory={handleSelectCategory}
        onSelectDate={handleSelectDate}
        onCancel={handleCancel}
        loading={submitting}
      />

      <List
        header={<div>Expenses</div>}
        footer={<div>Total</div>}
        bordered
        dataSource={expenses}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={formatDate(item.date)}
              description={item.category}
            />
            {item.amount}
          </List.Item>
        )}
        style={{ backgroundColor: 'white', marginTop: '24px' }}
      />
    </MainLayout>
  );
};

export default ExpensesPage;
