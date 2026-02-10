'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Space, Checkbox, Progress, Table } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ComplianceChecklistPage() {
  const categories = [
    { id: 1, name: 'Patient Privacy & Confidentiality', items: 15, completed: 14, status: 'Compliant', lastAudit: '2024-01-15' },
    { id: 2, name: 'Infection Control Standards', items: 20, completed: 18, status: 'Compliant', lastAudit: '2024-01-20' },
    { id: 3, name: 'Medication Safety Protocols', items: 12, completed: 12, status: 'Compliant', lastAudit: '2024-01-18' },
    { id: 4, name: 'Emergency Preparedness', items: 18, completed: 16, status: 'Compliant', lastAudit: '2024-01-22' },
    { id: 5, name: 'Staff Credentialing & Training', items: 10, completed: 9, status: 'Minor Issues', lastAudit: '2024-01-25' },
    { id: 6, name: 'Facility Safety Standards', items: 25, completed: 22, status: 'Compliant', lastAudit: '2024-01-28' },
    { id: 7, name: 'Documentation Requirements', items: 14, completed: 11, status: 'Needs Attention', lastAudit: '2024-02-01' },
    { id: 8, name: 'Quality Improvement Activities', items: 16, completed: 16, status: 'Compliant', lastAudit: '2024-02-03' },
  ];

  const items = [
    { id: 1, category: 'Patient Privacy', item: 'Patient consent forms properly maintained', status: 'compliant' },
    { id: 2, category: 'Patient Privacy', item: 'Medical records access log maintained', status: 'compliant' },
    { id: 3, category: 'Patient Privacy', item: 'Privacy training completed for all staff', status: 'non-compliant' },
    { id: 4, category: 'Infection Control', item: 'Hand hygiene compliance monitoring system', status: 'compliant' },
    { id: 5, category: 'Infection Control', item: 'Sterilization protocols followed', status: 'compliant' },
    { id: 6, category: 'Medication Safety', item: 'High-alert medication policies in place', status: 'compliant' },
    { id: 7, category: 'Medication Safety', item: 'Drug interaction checking system', status: 'compliant' },
    { id: 8, category: 'Emergency Preparedness', item: 'Emergency response team identified', status: 'compliant' },
    { id: 9, category: 'Staff Credentialing', item: 'License verification for all clinical staff', status: 'compliant' },
    { id: 10, category: 'Staff Credentialing', item: 'BLS certification for nursing staff', status: 'pending' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Title level={3}>Compliance Checklist</Title>
        <Space className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Button type="primary" className="w-full sm:w-auto">Run Audit</Button>
          <Button className="w-full sm:w-auto">Export Report</Button>
        </Space>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{categories.filter(c => c.status === 'Compliant').length}/{categories.length}</div>
            <div className="text-gray-500">Categories Compliant</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{Math.round(categories.reduce((sum, c) => sum + c.completed, 0) / categories.reduce((sum, c) => sum + c.items, 0) * 100)}%</div>
            <div className="text-gray-500">Overall Compliance</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{categories.reduce((sum, c) => sum + (c.items - c.completed), 0)}</div>
            <div className="text-gray-500">Items Pending</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{categories.reduce((sum, c) => sum + c.items, 0)}</div>
            <div className="text-gray-500">Total Checklist Items</div>
          </div>
        </Card>
      </div>

      <Card title="Compliance by Category" style={{ marginBottom: '24px' }}>
        <List
          dataSource={categories}
          renderItem={(category) => (
            <List.Item key={category.id}>
              <List.Item.Meta
                avatar={
                  <div style={{ width: '50px', textAlign: 'center' }}>
                    {category.status === 'Compliant' && <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                  </div>
                }
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <Tag color={category.status === 'Compliant' ? 'success' : category.status === 'Minor Issues' ? 'warning' : 'error'}>
                      {category.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Progress: {category.completed}/{category.items} items</span>
                      <span className="text-xs text-gray-500">Last audit: {category.lastAudit}</span>
                    </div>
                    <Progress percent={Math.round((category.completed / category.items) * 100)} size="small" strokeColor={category.status === 'Compliant' ? '#52c41a' : '#faad14'} />
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Detailed Checklist Items">
        <Table
          dataSource={items}
          columns={[
            { title: 'Item', dataIndex: 'item', key: 'item' },
            { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag icon={status === 'compliant' ? <CheckCircleOutlined /> : null} color={status === 'compliant' ? 'success' : status === 'pending' ? 'warning' : 'error'}>
                  {status}
                </Tag>
              ),
            },
            { title: 'Actions', key: 'actions', render: () => <Checkbox /> },
          ]}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
