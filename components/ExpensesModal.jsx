import { DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment-timezone';
import RoundCornerButton from './RoundCornerButton';
import { formRules } from '@/utils/formRules';
import { EXPENSE_CATEGORIES } from '@/constants/expense';

const ExpensesModal = props => {
  const { form, isVisible, onOk, onCancel, loading } = props;
  const today = moment.tz(moment.utc(), moment.tz.guess());
  const initialValues = {
    category: EXPENSE_CATEGORIES[0],
    date: today
  };

  return (
    <Modal visible={isVisible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="amount"
          label="Amount"
          rules={[formRules.MONEY_FORMAT]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select>
            {EXPENSE_CATEGORIES.map(category => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Date">
          <DatePicker />
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

export default ExpensesModal;
