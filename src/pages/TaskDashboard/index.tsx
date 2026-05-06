import { Card, Col, Row, Statistic, Button, Modal } from 'antd';
import { useTaskManager } from '@/hooks/useTaskManager';
import { TaskForm } from '@/components/TaskForm';
import { useState } from 'react';
import { PlusOutlined, TeamOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const TaskDashboard: React.FC = () => {
  const { getStats, addTask } = useTaskManager();
  const [visible, setVisible] = useState(false);
  const stats = getStats();

  const handleSubmit = (values: any) => {
    if (values.title) {
      addTask(values);
      setVisible(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col span={24}>
          <h1>Task Dashboard</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
            New Task
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <Statistic
              title="Total Tasks"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <ExclamationCircleOutlined style={{ marginRight: 8, color: '#f5222d' }} />
            <Statistic
              title="Overdue"
              value={stats.overdue}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="New Task"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <TaskForm onSubmit={handleSubmit} onCancel={() => setVisible(false)} />
      </Modal>
    </div>
  );
};

export default TaskDashboard;
