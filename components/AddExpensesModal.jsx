import { DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment-timezone';
import RoundCornerButton from './RoundCornerButton';
import { formRules } from '@/utils/formRules';
import { EXPENSE_CATEGORIES } from '@/constants/expense';

const AddExpensesModal = props => {
  const {
    form,
    isVisible,
    onAddExpenses,
    onSelectCategory,
    onSelectDate,
    onCancel,
    loading
  } = props;

  const today = moment.tz(moment.utc(), moment.tz.guess());
  return (
    <Modal visible={isVisible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        onFinish={onAddExpenses}
        initialValues={{ category: EXPENSE_CATEGORIES[0], date: today }}
        layout="vertical"
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[formRules.MONEY_FORMAT]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select
            onChange={categorySelected => onSelectCategory(categorySelected)}
          >
            {EXPENSE_CATEGORIES.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker onChange={onSelectDate} />
        </Form.Item>
        <Form.Item name="notes" label="Notes">
          <Input.TextArea showCount maxLength={30} />
        </Form.Item>
        <RoundCornerButton loading={loading} type="primary" htmlType="submit">
          Ok
        </RoundCornerButton>
      </Form>
    </Modal>
  );
};

export default AddExpensesModal;
