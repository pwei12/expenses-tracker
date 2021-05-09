import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { parse } from 'cookie';
import { Button, Form, message, Spin } from 'antd';
import { ArrowLeftOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from '@/utils/apiCall';
import MainLayout from '../components/MainLayout';
import ExpensesItemList from '../components/ExpensesList';
import { COOKIE_NAME } from '@/constants/auth';
import { EXPENSES_API_ROUTE, HOME_ROUTE } from '@/constants/route';
import moment from 'moment-timezone';
import { formatDateToBeSaved } from '@/utils/expense';

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
    `${process.env.domain}${EXPENSES_API_ROUTE}`,
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

  const handleCancel = () => {
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
        onCancel={handleCancel}
        loading={isSubmittingForm}
      />

      <ExpensesItemList
        expenses={expenses}
        onOpenEditExpenseModal={handleOpenEditExpenseModal}
        onDeleteExpenseItem={handleDeleteExpenseItem}
        isLoading={isUpdatingExpenses}
      />
    </MainLayout>
  );
};

export default ExpensesPage;
