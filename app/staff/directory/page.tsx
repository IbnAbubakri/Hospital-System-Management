'use client';

import React from 'react';
import { Card, Typography, List, Avatar, Input, Tag, Space } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffDirectoryPage() {
  const [searchText, setSearchText] = React.useState('');

  const staff = [
    { id: '1', name: 'Dr. Emeka Adeleke', role: 'Doctor', department: 'Cardiology', email: 'e.adeleke@hospital.com', phone: '+234 801 234 5678', photo: null },
    { id: '2', name: 'Dr. Ibrahim Musa', role: 'Doctor', department: 'General Medicine', email: 'i.musa@hospital.com', phone: '+234 802 345 6789', photo: null },
    { id: '3', name: 'Nurse Amaka Okafor', role: 'Nurse', department: 'Nursing', email: 'a.okafor@hospital.com', phone: '+234 803 456 7890', photo: null },
    { id: '4', name: 'Dr. Chinedu Okonkwo', role: 'Doctor', department: 'Orthopedics', email: 'c.okonkwo@hospital.com', phone: '+234 804 567 8901', photo: null },
    { id: '5', name: 'Dr. Aisha Yusuf', role: 'Doctor', department: 'Pediatrics', email: 'a.yusuf@hospital.com', phone: '+234 805 678 9012', photo: null },
  ];

  const filteredStaff = staff.filter((s: any) =>
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.department.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={3}>Staff Directory</Title>

      <Card style={{ marginBottom: '24px' }}>
        <Input.Search
          placeholder="Search by name, department, or role..."
          allowClear
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />
      </Card>

      <Card title="All Staff ({filteredStaff.length})">
        <List
          dataSource={filteredStaff}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} style={{ background: '#3B82F6' }}>
                    {item.name.charAt(0)}
                  </Avatar>
                }
                title={
                  <Space>
                    <span className="font-medium">{item.name}</span>
                    <Tag color="blue">{item.role}</Tag>
                    <Tag>{item.department}</Tag>
                  </Space>
                }
                description={
                  <Space orientation="vertical" size="small">
                    <Text type="secondary">📧 {item.email}</Text>
                    <Text type="secondary">📱 {item.phone}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
