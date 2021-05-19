import { List, Tooltip, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDateForDisplay } from '@/utils/expense';

const ExpensesList = props => {
  const {
    expenses,
    onOpenEditExpenseModal,
    onDeleteExpenseItem,
    isLoading
  } = props;

  return (
    <List
      bordered
      dataSource={expenses}
      loading={isLoading}
      renderItem={item => (
        <List.Item>
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
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default ExpensesList;
