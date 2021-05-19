import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { parse } from 'cookie';
import { Button, Col, Form, message, Row, Select, Typography } from 'antd';
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from '@/utils/apiCall';
import MainLayout from '../components/MainLayout';
import ExpensesItemList from '../components/ExpensesItemList';
import { COOKIE_NAME } from '@/constants/auth';
import { EXPENSES_API_ROUTE, HOME_ROUTE } from '@/constants/route';
import moment from 'moment-timezone';
import {
  formatDateToBeSaved,
  sumUpExpenses,
  formatExpensesForDisplayByCategory,
  formatExpensesForDisplayByMonth
} from '@/utils/expense';
import { SHOW_EXPENSES_BY } from '@/constants/expense';

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
const SUCCESSFUL_EDIT_EXPENSES_MESSAGE = 'Updated expenses';
const SUCCESSFUL_DELETE_EXPENSES_MESSAGE = 'Deleted expenses';

const ExpensesModal = dynamic(() => import('../components/ExpensesModal'), {
  ssr: false
});

export const getServerSideProps = async context => {
  const headersCookie = context.req.headers?.cookie ?? '';
  const cookies = parse(headersCookie);
  const hasLoggedIn = Boolean(cookies[COOKIE_NAME]);

  if (!hasLoggedIn) {
    return {
      redirect: {
        destination: HOME_ROUTE,
        permanent: false
      }
    };
  }

  const response = await getRequest(
    `${process.env.DOMAIN}${EXPENSES_API_ROUTE}`,
    headersCookie
  );

  if (!response.success) {
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

const ExpensesPage = ({ hasLoggedIn, ssrExpenses, headersCookie }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState('');
  const [isUpdatingExpenses, setIsUpdatingExpenses] = useState(false);
  const [showBy, setShowBy] = useState(SHOW_EXPENSES_BY[0]);

  useEffect(() => {
    setExpenses(ssrExpenses);
  }, [ssrExpenses]);

  const handleOpenExpenseModal = () => {
    setIsModalVisible(true);
  };

  const handleOpenEditExpenseModal = expense => {
    setEditingItemId(expense._id);
    form.setFieldsValue({ ...expense, date: moment(expense.date) });
    handleOpenExpenseModal();
  };

  const handleCloseExpenseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddExpenseItem = async formValue => {
    setIsSubmittingForm(true);
    setIsModalVisible(false);
    setIsUpdatingExpenses(true);
    const payload = {
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      date: formatDateToBeSaved(formValue.date),
      notes: formValue.notes ?? ''
    };
    try {
      const response = await postRequest(
        EXPENSES_API_ROUTE,
        payload,
        headersCookie
      );
      if (response.success) {
        setExpenses(currentExpenses => [
          ...currentExpenses,
          { ...payload, ...response.data }
        ]);
        message.success(SUCCESSFUL_ADD_EXPENSES_MESSAGE);
      } else {
        throw response.reason;
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsSubmittingForm(false);
      form.resetFields();
      setIsUpdatingExpenses(false);
    }
  };

  const handleEditExpenseItem = async formValue => {
    setIsSubmittingForm(true);
    setIsModalVisible(false);
    setIsUpdatingExpenses(true);
    const payload = {
      id: editingItemId,
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      date: formatDateToBeSaved(formValue.date),
      notes: formValue.notes ?? ''
    };
    try {
      const response = await putRequest(
        EXPENSES_API_ROUTE,
        payload,
        headersCookie
      );
      if (response.success) {
        setExpenses(currentExpenses => {
          return [...currentExpenses].map(expenseItem => {
            const isItemBeingEdited = expenseItem._id === editingItemId;
            return isItemBeingEdited
              ? { ...payload, _id: response.data._id }
              : expenseItem;
          });
        });
        message.success(SUCCESSFUL_EDIT_EXPENSES_MESSAGE);
      } else {
        throw response.reason;
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsSubmittingForm(false);
      setEditingItemId('');
      form.resetFields();
      setIsUpdatingExpenses(false);
    }
  };

  const handleDeleteExpenseItem = async expenseItemId => {
    try {
      setIsUpdatingExpenses(true);
      const response = await deleteRequest(
        EXPENSES_API_ROUTE,
        {
          id: expenseItemId
        },
        headersCookie
      );
      if (response.success) {
        setExpenses(currentExpenses =>
          [...currentExpenses].filter(
            expenseItem => expenseItem._id !== expenseItemId
          )
        );
        message.success(SUCCESSFUL_DELETE_EXPENSES_MESSAGE);
      } else {
        throw response.reason;
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsUpdatingExpenses(false);
    }
  };

  const redirectToHome = () => {
    router.push(HOME_ROUTE);
  };

  const handleChangeShowBy = showBy => {
    setShowBy(showBy);
  };

  return (
    <MainLayout hasLoggedIn={hasLoggedIn} hasAuthButton={hasLoggedIn}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledButton
          icon={
            <ArrowLeftOutlined
              style={{ fontSize: '20px' }}
              onClick={redirectToHome}
            />
          }
        />
        <StyledButton
          icon={<PlusCircleOutlined style={{ fontSize: '24px' }} />}
          onClick={handleOpenExpenseModal}
        />
      </div>

      <ExpensesModal
        form={form}
        isVisible={isModalVisible}
        onOk={!!editingItemId ? handleEditExpenseItem : handleAddExpenseItem}
        onCancel={handleCloseExpenseModal}
        loading={isSubmittingForm}
      />
      <div>
        <span style={{ marginRight: '12px' }}>Show by:</span>
        <Select defaultValue={showBy} onChange={handleChangeShowBy}>
          <Select.Option value={SHOW_EXPENSES_BY[0]}>Month</Select.Option>
          <Select.Option value={SHOW_EXPENSES_BY[1]}>Category</Select.Option>
        </Select>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          marginTop: '16px',
          border: '1px solid #d9d9d9'
        }}
      >
        <Typography.Title
          level={4}
          style={{
            padding: '16px',
            border: '1px solid #d9d9d9',
            margin: '0px'
          }}
        >
          Expenses
        </Typography.Title>
        {Object.entries(
          showBy === SHOW_EXPENSES_BY[0]
            ? formatExpensesForDisplayByMonth(expenses)
            : formatExpensesForDisplayByCategory(expenses)
        ).map(([title, expenses]) => (
          <div key={title}>
            <div
              style={{
                backgroundColor: '#081136',
                padding: '16px',
                color: 'white'
              }}
            >
              {title}
            </div>
            <ExpensesItemList
              expenses={expenses}
              onOpenEditExpenseModal={handleOpenEditExpenseModal}
              onDeleteExpenseItem={handleDeleteExpenseItem}
              isLoading={isUpdatingExpenses}
            />
          </div>
        ))}
        <Row justify="space-between" style={{ padding: '16px' }}>
          <Col>Total</Col>
          <Col>
            <Typography.Text strong>{sumUpExpenses(expenses)}</Typography.Text>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default ExpensesPage;
