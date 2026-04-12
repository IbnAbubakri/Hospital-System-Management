'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Table, Tag, DatePicker, TimePicker, Select, App } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffRosterPage() {
  const { message } = App.useApp();
  const [roster] = useState([
    { id: '1', date: '2024-02-05', shift: 'Morning', doctor: 'Dr. Ngozi Adeleke', nurse: 'Nurse Amaka Okafor' },
    { id: '2', date: '2024-02-05', shift: 'Afternoon', doctor: 'Dr. Emeka Okoro', nurse: 'Nurse Grace Adebayo' },
    { id: '3', date: '2024-02-05', shift: 'Night', doctor: 'Dr. Tunde Bakare', nurse: 'Nurse Chinedu Eze' },
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
    <div className="  sm: sm: lg: lg: max-w-6xl mx-auto">
      <Title level={3}>Staff Roster Management</Title>
      <Card>
        <Table dataSource={roster} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
