import { Button, DatePicker, Form, Input, Select, Space, Tag } from 'antd';
import { Task } from '@/types/task';
import moment from 'moment';
import { useState } from 'react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      deadline: values.deadline ? values.deadline.toISOString() : undefined,
      tags,
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        title: task?.title,
        description: task?.description,
        priority: task?.priority || 'medium',
        status: task?.status || 'todo',
        deadline: task?.deadline ? moment(task.deadline) : undefined,
      }}
    >
      <Form.Item name="title" label="Task Name" rules={[{ required: true, message: 'Please enter task name' }]}>
        <Input placeholder="Enter task name" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} placeholder="Enter task description" />
      </Form.Item>

      <Form.Item name="priority" label="Priority">
        <Select>
          <Select.Option value="low">Low</Select.Option>
          <Select.Option value="medium">Medium</Select.Option>
          <Select.Option value="high">High</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select>
          <Select.Option value="todo">To Do</Select.Option>
          <Select.Option value="doing">Doing</Select.Option>
          <Select.Option value="done">Done</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="deadline" label="Deadline">
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="Tags">
        <Space wrap>
          <Input
            placeholder="Enter tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onPressEnter={() => {
              if (tagInput.trim()) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
              }
            }}
            style={{ width: '150px' }}
          />
          <Button onClick={() => {
            if (tagInput.trim()) {
              setTags([...tags, tagInput.trim()]);
              setTagInput('');
            }
          }}>
            Add
          </Button>
        </Space>
        <div style={{ marginTop: 8 }}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => setTags(tags.filter((t) => t !== tag))}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {task ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
