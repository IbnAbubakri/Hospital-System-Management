'use client';

import React from 'react';
import { Card, Typography, List, Tag, Progress } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function StaffTrainingPage() {
  const trainingPrograms = [
    { id: '1', name: 'BLS/CPR Certification', category: 'Mandatory', completed: 45, total: 50, status: 'In Progress' },
    { id: '2', name: 'Infection Control', category: 'Mandatory', completed: 100, total: 100, status: 'Completed' },
    { id: '3', name: 'Data Privacy Training', category: 'Compliance', completed: 0, total: 30, status: 'Not Started' },
    { id: '4', name: 'Customer Service Skills', category: 'Soft Skills', completed: 20, total: 20, status: 'Completed' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={3}>Training & Development</Title>
      <Card title="Training Programs">
        <List
          dataSource={trainingPrograms}
          renderItem={(program) => (
            <List.Item>
              <List.Item.Meta
                avatar={<TrophyOutlined style={{ fontSize: '20px', color: '#F59E0B' }} />}
                title={<span className="font-medium">{program.name}</span>}
                description={
                  <div>
                    <Tag color="blue">{program.category}</Tag>
                    <Progress percent={program.completed / program.total * 100} size="small" style={{ marginTop: '8px' }} />
                  </div>
                }
              />
              <Tag color={program.status === 'Completed' ? 'success' : program.status === 'In Progress' ? 'processing' : 'default'}>
                {program.status}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
