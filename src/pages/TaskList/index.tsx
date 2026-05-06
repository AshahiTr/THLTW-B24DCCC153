import { Button, Input, Modal, Select, Space, Table, Tag, DatePicker, Card as AntCard } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Task } from '@/types/task';
import { TaskForm } from '@/components/TaskForm';
import { useState, useMemo } from 'react';
import moment from 'moment';

const TaskList: React.FC = () => {
  const { tasks, updateTask, deleteTask, addTask } = useTaskManager();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [deadlineRange, setDeadlineRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
      const matchPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      let matchDeadline = true;
      if (deadlineRange && deadlineRange[0] && deadlineRange[1] && task.deadline) {
        const d = moment(task.deadline);
        matchDeadline = d.isAfter(deadlineRange[0]) && d.isBefore(deadlineRange[1]);
      }
      return matchSearch && matchStatus && matchPriority && matchDeadline;
    });
  }, [tasks, search, statusFilter, priorityFilter, deadlineRange]);

  const handleSubmit = (values: any) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setOpen(false);
    setEditingTask(undefined);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = { low: 'blue', medium: 'gold', high: 'red' };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { todo: 'default', doing: 'processing', done: 'success' };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { todo: 'To Do', doing: 'Doing', done: 'Done' };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' };
    return labels[priority] || priority;
  };

  const isOverdue = (task: Task) => {
    return task.deadline && task.status !== 'done' && moment(task.deadline).isBefore(moment(), 'day');
  };

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <span style={{ color: isOverdue(record) ? '#f5222d' : 'inherit' }}>
          {isOverdue(record) && '⚠ '}
          {text}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (text: string) => (text ? `${text.substring(0, 50)}...` : '-'),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
      ],
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{getPriorityLabel(priority)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline?: string) => {
        if (!deadline) return '-';
        const d = moment(deadline);
        const isLate = d.isBefore(moment(), 'day');
        return (
          <span style={{ color: isLate ? '#f5222d' : 'inherit' }}>
            {d.format('DD/MM/YYYY HH:mm')}
          </span>
        );
      },
      sorter: (a: Task, b: Task) => {
        const aDate = a.deadline ? moment(a.deadline).valueOf() : 0;
        const bDate = b.deadline ? moment(b.deadline).valueOf() : 0;
        return aDate - bDate;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags?: string[]) =>
        tags?.map((tag) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        )),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: Task) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTask(record);
              setOpen(true);
            }}
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Delete Task',
                content: 'Are you sure?',
                onOk: () => deleteTask(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Task List</h1>
      </div>

      <AntCard style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input.Search
            placeholder="Search task by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />

          <Space wrap>
            <Select
              mode="multiple"
              placeholder="Filter by status"
              style={{ width: 200 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'To Do', value: 'todo' },
                { label: 'Doing', value: 'doing' },
                { label: 'Done', value: 'done' },
              ]}
            />

            <Select
              mode="multiple"
              placeholder="Filter by priority"
              style={{ width: 200 }}
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />

            <DatePicker.RangePicker
              value={deadlineRange}
              onChange={(dates) => setDeadlineRange(dates as any)}
              placeholder={['Start', 'End']}
            />

            <Button onClick={() => {
              setSearch('');
              setStatusFilter([]);
              setPriorityFilter([]);
              setDeadlineRange(null);
            }}>
              Reset
            </Button>

            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingTask(undefined);
              setOpen(true);
            }}>
              New Task
            </Button>
          </Space>
        </Space>
      </AntCard>

      <div style={{ marginBottom: 24 }}>
        <strong>Found {filteredTasks.length} task(s)</strong>
      </div>

      <Table
        dataSource={filteredTasks}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingTask ? 'Edit Task' : 'New Task'}
        visible={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
          setEditingTask(undefined);
        }}
        destroyOnClose
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setOpen(false);
            setEditingTask(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default TaskList;
