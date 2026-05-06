import { Button, Card, Empty, Modal, Space, Tag, Tooltip } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Task, TaskStatus } from '@/types/task';
import { TaskForm } from '@/components/TaskForm';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const TaskKanban: React.FC = () => {
  const { tasks, moveTask, addTask, updateTask, deleteTask } = useTaskManager();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();


  const columns: { key: TaskStatus; title: string }[] = [
    { key: 'todo', title: 'To Do' },
    { key: 'doing', title: 'Doing' },
    { key: 'done', title: 'Done' },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId) {
      moveTask(draggableId, destination.droppableId as TaskStatus);
    }
  };

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

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return '';
    const d = moment(deadline);
    const now = moment();
    if (d.isBefore(now, 'day')) return `Overdue: ${d.format('DD/MM')}`;
    if (d.isSame(now, 'day')) return 'Today';
    if (d.isSame(now.add(1, 'day'), 'day')) return 'Tomorrow';
    return d.format('DD/MM');
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Kanban Board</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTask(undefined);
            setOpen(true);
          }}
        >
          New Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 24 }}>
          {columns.map((col) => (
            <div key={col.key} style={{ minWidth: 320, flex: '0 0 auto' }}>
              <Card title={col.title} style={{ height: '100%' }}>
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 400,
                        backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'transparent',
                        borderRadius: 4,
                        padding: 8,
                      }}
                    >
                      {tasks
                        .filter((t) => t.status === col.key)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  marginBottom: 12,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <Card
                                  size="small"
                                  style={{
                                    backgroundColor: snapshot.isDragging ? '#fff7e6' : '#fff',
                                    cursor: 'grab',
                                  }}
                                >
                                  <div style={{ marginBottom: 8 }}>
                                    <strong>{task.title}</strong>
                                  </div>
                                  {task.description && (
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: '#666',
                                        marginBottom: 8,
                                      }}
                                    >
                                      {task.description}
                                    </div>
                                  )}
                                  <Space size={4} wrap style={{ marginBottom: 8 }}>
                                    <Tag color={getPriorityColor(task.priority)}>
                                      {task.priority}
                                    </Tag>
                                    {task.deadline && (
                                      <Tooltip title={`Deadline: ${moment(task.deadline).format('DD/MM/YYYY HH:mm')}`}>
                                        <Tag>{formatDeadline(task.deadline)}</Tag>
                                      </Tooltip>
                                    )}
                                  </Space>
                                  {task.tags && task.tags.length > 0 && (
                                    <div style={{ marginBottom: 8 }}>
                                      {task.tags.map((t) => (
                                        <Tag key={t} color="blue">
                                          {t}
                                        </Tag>
                                      ))}
                                    </div>
                                  )}
                                  <Space size="small">
                                    <Button
                                      type="text"
                                      size="small"
                                      icon={<EditOutlined />}
                                      onClick={() => {
                                        setEditingTask(task);
                                        setOpen(true);
                                      }}
                                    />
                                    <Button
                                      type="text"
                                      danger
                                      size="small"
                                      icon={<DeleteOutlined />}
                                      onClick={() => deleteTask(task.id)}
                                    />
                                  </Space>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      {tasks.filter((t) => t.status === col.key).length === 0 && (
                        <Empty description="No tasks" style={{ marginTop: 20 }} />
                      )}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>

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

export default TaskKanban;
