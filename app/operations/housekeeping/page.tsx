'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Space, Calendar, Button, App } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function HousekeepingPage() {
  const { message } = App.useApp();
  const tasks = [
    { id: 'HK-001', task: 'Clean Ward 3 Rooms', location: 'Ward 3', priority: 'High', frequency: 'Daily', assignedTo: 'Housekeeping Staff A', status: 'Completed', lastCompleted: '2024-02-05 14:00', nextScheduled: '2024-02-06 08:00' },
    { id: 'HK-002', task: 'Clean Operating Theaters', location: 'OT', priority: 'High', frequency: 'Per Procedure', assignedTo: 'Housekeeping Staff B', status: 'In Progress', lastCompleted: '2024-02-05 13:00', nextScheduled: '2024-02-05 15:00' },
    { id: 'HK-003', task: 'Lobby and Reception Area', location: 'Main Entrance', priority: 'Medium', frequency: 'Hourly', assignedTo: 'Housekeeping Staff C', status: 'Pending', lastCompleted: '2024-02-05 13:00', nextScheduled: '2024-02-05 15:00' },
    { id: 'HK-004', task: 'Patient Room Discharge Cleaning', location: 'Ward 2', priority: 'High', frequency: 'On Demand', assignedTo: 'Housekeeping Staff A', status: 'Pending', lastCompleted: '-', nextScheduled: '2024-02-05 16:00' },
    { id: 'HK-005', task: 'Restroom Cleaning - Public Areas', location: 'All Floors', priority: 'Medium', frequency: 'Every 2 Hours', assignedTo: 'Housekeeping Staff C', status: 'Completed', lastCompleted: '2024-02-05 14:00', nextScheduled: '2024-02-05 16:00' },
  ];

  // Handle mark complete
  const handleMarkComplete = (record: any) => {
    message.success(`Marking task '${record.task}' as complete`);
  };

  // Handle view details
  const handleViewDetails = (record: any) => {
    message.success(`Viewing details for task '${record.task}'`);
  };

  const columns = [
    { title: 'Task ID', dataIndex: 'id', key: 'id' },
    { title: 'Task', dataIndex: 'task', key: 'task' },
    { title: 'Location', dataIndex: 'location', key: 'location', render: (loc: string) => <Tag color="blue">{loc}</Tag> },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => <Tag color={priority === 'High' ? 'error' : 'warning'}>{priority}</Tag>,
    },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: 'Last Completed', dataIndex: 'lastCompleted', key: 'lastCompleted' },
    { title: 'Next Scheduled', dataIndex: 'nextScheduled', key: 'nextScheduled' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Completed' ? 'success' : status === 'In Progress' ? 'processing' : 'warning'}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleMarkComplete(record)}>Mark Complete</Button>
          <Button type="link" size="small" onClick={() => handleViewDetails(record)}>View Details</Button>
        </Space>
      ),
    },
  ];

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="   ">
        <Title level={3}>Housekeeping Management</Title>
        <Button type="primary" icon={<ClearOutlined />}>Add Task</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold ">{completed}</div>
            <div className="">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold ">{inProgress}</div>
            <div className="">In Progress</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold ">{pending}</div>
            <div className="">Pending</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{tasks.length}</div>
            <div className="">Total Tasks</div>
          </div>
        </Card>
      </div>

      <Card title="Housekeeping Schedule">
        <Table dataSource={tasks} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
