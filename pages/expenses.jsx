import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { parse } from 'cookie';
import {
  Button,
  Form,
  List,
  message,
  Typography,
  Row,
  Col,
  Tooltip
} from 'antd';
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
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
  const headersCookie = context.req.headers?.cookie ?? '';
  const cookies = parse(headersCookie);
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
    `${process.env.domain}${EXPENSES_API_ROUTE}`,
    headersCookie
  );

  if (!response) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      hasLoggedIn,
      ssrExpenses: response.success ? response.data : {},
      headersCookie
    }
  };
};

const ExpenseListFooter = ({ totalExpenses }) => {
  return (
    <Row justify="end" gutter={24}>
      <Col>Total</Col>
      <Col>{totalExpenses}</Col>
    </Row>
  );
};

const ExpensesPage = ({ hasLoggedIn, ssrExpenses, headersCookie }) => {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setExpenses(ssrExpenses);
  }, [ssrExpenses]);

  const handleOpenExpenseModal = () => {
    setIsModalVisible(true);
  };

  const handleOpenEditExpenseModal = expense => {
    const date = moment(expense.date);
    form.setFieldsValue({ ...expense, date });
    handleOpenExpenseModal();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
      const response = await postRequest(
        EXPENSES_API_ROUTE,
        payload,
        headersCookie
      );
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

  const formatDate = date => {
    return moment
      .tz(moment(date).utc(), moment.tz.guess())
      .format('D MMM yyyy');
  };

  const sumUpExpenses = expenses => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <MainLayout hasLoggedIn={hasLoggedIn} hasAuthButton={hasLoggedIn}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>Expenses</Typography.Title>
        <StyledButton
          icon={<PlusCircleOutlined style={{ fontSize: '24px' }} />}
          onClick={handleOpenExpenseModal}
        ></StyledButton>
      </div>

      <AddExpensesModal
        form={form}
        isVisible={isModalVisible}
        onAddExpenses={handleAddExpenses}
        onCancel={handleCancel}
        loading={submitting}
      />

      <List
        footer={<ExpenseListFooter totalExpenses={sumUpExpenses(expenses)} />}
        bordered
        dataSource={expenses}
        renderItem={item => (
          <List.Item actions={[]}>
            <List.Item.Meta
              avatar={
                <Tooltip title="Edit">
                  <EditOutlined
                    onClick={() => handleOpenEditExpenseModal(item)}
                  />
                </Tooltip>
              }
              title={formatDate(item.date)}
              description={`[${item.category}] ${item.notes}`}
            />
            {item.amount}
          </List.Item>
        )}
        style={{ backgroundColor: 'white', marginTop: '16px' }}
      />
    </MainLayout>
  );
};

export default ExpensesPage;
