import { useState } from 'react';
import dynamic from 'next/dynamic';
import { parse } from 'cookie';
import { Button, Form } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import MainLayout from '../components/MainLayout';
import { COOKIE_NAME } from '@/constants/auth';

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
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddExpenses = formValue => {
    setSubmitting(true);
    //   TODO: call api to add expenses
    setIsModalVisible(false);
    setSubmitting(false);
    console.log('forma value', formValue);
  };

  const handleSelectCategory = category => {
    console.log('select category', category);
  };

  const handleSelectDate = date => {
    console.log('select date', date);
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
    </MainLayout>
  );
};

export default ExpensesPage;
