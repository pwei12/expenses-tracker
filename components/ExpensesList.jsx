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
  const { expenses, onOpenEditExpenseModal, onDeleteExpenseItem } = props;

  return (
    <List
      footer={<ExpenseListFooter totalExpenses={sumUpExpenses(expenses)} />}
      bordered
      dataSource={sortExpensesByDate(expenses)}
      renderItem={item => (
        <List.Item actions={[]}>
          <List.Item.Meta
            avatar={
              <Space>
                <Tooltip title="Edit">
                  <EditOutlined onClick={() => onOpenEditExpenseModal(item)} />
                </Tooltip>
                <Popconfirm
                  title="Confirm delete item?"
                  onConfirm={() => onDeleteExpenseItem(item._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Remove">
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
