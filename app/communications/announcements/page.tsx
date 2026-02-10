'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Space, Input, Select, Modal, Form, DatePicker, App } from 'antd';
import { PlusOutlined, BellOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

export default function AnnouncementsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const announcements = [
    {
      id: 1,
      title: 'System Maintenance Scheduled',
      content: 'The hospital management system will be undergoing maintenance on February 10, 2024 from 10:00 PM to 2:00 AM. Some services may be temporarily unavailable.',
      category: 'System',
      priority: 'High',
      targetAudience: 'All Staff',
      createdBy: 'IT Department',
      createdDate: '2024-02-05',
      expiryDate: '2024-02-10',
      status: 'Active',
      views: 245},
    {
      id: 2,
      title: 'New Quality Improvement Initiative',
      content: 'We are launching a new quality improvement initiative focused on reducing medication errors. All pharmacy and nursing staff are required to attend training sessions starting next week.',
      category: 'Clinical',
      priority: 'Medium',
      targetAudience: 'Clinical Staff',
      createdBy: 'Quality Assurance',
      createdDate: '2024-02-04',
      expiryDate: '2024-03-01',
      status: 'Active',
      views: 189},
    {
      id: 3,
      title: 'Updated Billing Policies',
      content: 'New billing policies effective from February 15, 2024. All staff should review the updated procedures in the employee portal.',
      category: 'Administrative',
      priority: 'Medium',
      targetAudience: 'Administrative Staff',
      createdBy: 'Finance Department',
      createdDate: '2024-02-03',
      expiryDate: '2024-02-20',
      status: 'Active',
      views: 156},
    {
      id: 4,
      title: 'Holiday Schedule for Eid al-Fitr',
      content: 'The hospital will operate on reduced hours during Eid al-Fitr. Please check the department-specific schedules.',
      category: 'General',
      priority: 'Low',
      targetAudience: 'All Staff',
      createdBy: 'HR Department',
      createdDate: '2024-01-28',
      expiryDate: '2024-02-15',
      status: 'Expired',
      views: 342},
  ];

  const handlePost = () => {
    form.validateFields().then((values) => {
      message.success('Announcement posted successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Announcements</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          New Announcement
        </Button>
      </div>

      <Card title="Active Announcements">
        <List
          dataSource={announcements.filter(a => a.status === 'Active')}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<BellOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                title={
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{item.title}</span>
                      <div className="flex gap-2 mt-1">
                        <Tag color="blue">{item.category}</Tag>
                        <Tag color={item.priority === 'High' ? 'error' : item.priority === 'Medium' ? 'warning' : 'default'}>
                          {item.priority} Priority
                        </Tag>
                        <Tag color="purple">{item.targetAudience}</Tag>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{item.views} views</div>
                  </div>
                }
                description={
                  <div>
                    <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                    <div className="text-xs text-gray-500">
                      Posted by {item.createdBy} on {item.createdDate} • Expires: {item.expiryDate}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Create Announcement"
        open={isModalVisible}
        onOk={handlePost}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter announcement title" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="system">System</Select.Option>
              <Select.Option value="clinical">Clinical</Select.Option>
              <Select.Option value="administrative">Administrative</Select.Option>
              <Select.Option value="general">General</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetAudience" label="Target Audience" rules={[{ required: true }]}>
            <Select placeholder="Select audience">
              <Select.Option value="all">All Staff</Select.Option>
              <Select.Option value="clinical">Clinical Staff</Select.Option>
              <Select.Option value="administrative">Administrative Staff</Select.Option>
              <Select.Option value="management">Management Only</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter announcement content" />
          </Form.Item>
          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
