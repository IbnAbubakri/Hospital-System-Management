'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Table, Tag, DatePicker, TimePicker, Select, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffRosterPage() {
  const { message } = App.useApp();
  const [roster] = useState([
    { id: '1', date: '2024-02-05', shift: 'Morning', doctor: 'Dr. Emeka Adeleke', nurse: 'Nurse Amaka Okafor' },
    { id: '2', date: '2024-02-05', shift: 'Afternoon', doctor: 'Dr. Ibrahim Musa', nurse: 'Nurse Grace Adebayo' },
    { id: '3', date: '2024-02-05', shift: 'Night', doctor: 'Dr. Chinedu Okonkwo', nurse: 'Nurse Chinedu Eze' },
  ]);

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Shift', dataIndex: 'shift', key: 'shift', render: (shift: string) => <Tag>{shift}</Tag> },
    { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
    { title: 'Nurse', dataIndex: 'nurse', key: 'nurse' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => <Button type="link" size="small">Edit</Button>},
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Staff Roster Management</Title>
      <Card>
        <Table dataSource={roster} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
