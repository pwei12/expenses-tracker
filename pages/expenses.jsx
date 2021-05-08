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
  Tooltip,
  Space,
  Popconfirm
} from 'antd';
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from '@/utils/apiCall';
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
const SUCCESSFUL_EDIT_EXPENSES_MESSAGE = 'Updated expenses';
const SUCCESSFUL_DELETE_EXPENSES_MESSAGE = 'Deleted expenses';

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
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState('');

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
    const payload = {
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      date: moment.tz(formValue.date.utc(), moment.tz.guess()),
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
    }
  };

  const handleEditExpenseItem = async formValue => {
    setIsSubmittingForm(true);
    setIsModalVisible(false);
    const payload = {
      id: editingItemId,
      amount: parseFloat(formValue.amount),
      category: formValue.category,
      date: moment.tz(formValue.date.utc(), moment.tz.guess()),
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
    }
  };

  const handleDeleteExpenseItem = async expenseItemId => {
    try {
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
        onOk={!!editingItemId ? handleEditExpenseItem : handleAddExpenseItem}
        onCancel={handleCancel}
        loading={isSubmittingForm}
      />

      <List
        footer={<ExpenseListFooter totalExpenses={sumUpExpenses(expenses)} />}
        bordered
        dataSource={expenses}
        renderItem={item => (
          <List.Item actions={[]}>
            <List.Item.Meta
              avatar={
                <Space>
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() => handleOpenEditExpenseModal(item)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Confirm delete item?"
                    onConfirm={() => handleDeleteExpenseItem(item._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Remove">
                      <DeleteOutlined />
                    </Tooltip>
                  </Popconfirm>
                </Space>
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
