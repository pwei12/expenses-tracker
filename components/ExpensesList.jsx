import { List, Row, Col, Tooltip, Space, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  formatDateForDisplay,
  sumUpExpenses,
  sortExpensesByDate
} from '@/utils/expense';

const ExpenseListFooter = ({ totalExpenses }) => {
  return (
    <Row justify="end" gutter={24}>
      <Col>Total</Col>
      <Col>
        <Typography.Text strong>{totalExpenses}</Typography.Text>
      </Col>
    </Row>
  );
};

const ExpensesList = props => {
  const {
    expenses,
    onOpenEditExpenseModal,
    onDeleteExpenseItem,
    isLoading
  } = props;

  return (
    <List
      header={<Typography.Title level={4}>Expenses</Typography.Title>}
      footer={<ExpenseListFooter totalExpenses={sumUpExpenses(expenses)} />}
      bordered
      dataSource={sortExpensesByDate(expenses)}
      loading={isLoading}
      renderItem={item => (
        <List.Item actions={[]}>
          <List.Item.Meta
            avatar={
              <Space>
                <Tooltip title="Edit" zIndex={1}>
                  <EditOutlined onClick={() => onOpenEditExpenseModal(item)} />
                </Tooltip>
                <Popconfirm
                  title="Confirm delete item?"
                  onConfirm={() => onDeleteExpenseItem(item._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Remove" zIndex={1}>
                    <DeleteOutlined />
                  </Tooltip>
                </Popconfirm>
              </Space>
            }
            title={formatDateForDisplay(item.date)}
            description={`[${item.category}] ${item.notes}`}
          />
          {item.amount}
        </List.Item>
      )}
      style={{ backgroundColor: 'white', marginTop: '16px' }}
    />
  );
};

export default ExpensesList;
