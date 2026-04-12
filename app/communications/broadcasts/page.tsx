'use client';

import React from 'react';
import { Card, Typography, Form, Input, Select, Button, Space, List, Tag, Modal, App } from 'antd';
import { SendOutlined, BulbOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

export default function BroadcastsPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const broadcasts = [
    {
      id: 1,
      title: 'Emergency Drill - February 15',
      type: 'Emergency',
      message: 'All staff to participate in fire safety drill scheduled for February 15, 2024 at 10:00 AM.',
      targetAudience: 'All Staff',
      sentBy: 'Safety Officer',
      sentDate: '2024-02-05 14:00',
      recipients: 245,
      status: 'Delivered'},
    {
      id: 2,
      title: 'New COVID-19 Protocols',
      type: 'Clinical',
      message: 'Updated COVID-19 protocols effective immediately. All clinical staff to review new guidelines in the policy portal.',
      targetAudience: 'Clinical Staff',
      sentBy: 'Infection Control',
      sentDate: '2024-02-04 09:00',
      recipients: 128,
      status: 'Delivered'},
    {
      id: 3,
      title: 'System Upgrade Complete',
      type: 'System',
      message: 'System upgrade successfully completed. New features now available including enhanced reporting and telemedicine modules.',
      targetAudience: 'All Staff',
      sentBy: 'IT Department',
      sentDate: '2024-02-03 16:30',
      recipients: 245,
      status: 'Delivered'},
    {
      id: 4,
      title: 'Staff Meeting Rescheduled',
      type: 'Administrative',
      message: 'Monthly staff meeting rescheduled from February 5 to February 8, 2024 at 2:00 PM in Conference Room A.',
      targetAudience: 'All Staff',
      sentBy: 'HR Department',
      sentDate: '2024-02-02 11:00',
      recipients: 245,
      status: 'Delivered'},
  ];

  const handleSend = () => {
    form.validateFields().then((values) => {
      message.success('Broadcast sent successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="  sm: sm: lg: lg: max-w-6xl mx-auto">
      <div className=" -col sm:-row items-start sm:   ">
        <Title level={3}>Broadcast Messages</Title>
        <Button type="primary" icon={<BulbOutlined />} onClick={() => setIsModalVisible(true)}>
          Send Broadcast
        </Button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]  ">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold ">{broadcasts.length}</div>
            <div className="">Total Broadcasts</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold ">{broadcasts.reduce((sum, b) => sum + b.recipients, 0)}</div>
            <div className="">Total Recipients</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{broadcasts.filter(b => b.status === 'Delivered').length}</div>
            <div className="">Successfully Delivered</div>
          </div>
        </Card>
      </div>

      <Card title="Broadcast History">
        <List
          dataSource={broadcasts}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<SendOutlined className="text-2xl " />}
                title={
                  <div className="  ">
                    <span className="font-medium">{item.title}</span>
                    <Tag color={item.type === 'Emergency' ? 'error' : 'blue'}>{item.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <p className="  ">{item.message}</p>
                    <div className="   ">
                      <span>Target: {item.targetAudience}</span>
                      <span>Sent by: {item.sentBy}</span>
                      <span>Date: {item.sentDate}</span>
                      <span>Recipients: {item.recipients}</span>
                      <span><CheckCircleOutlined style={{ color: '#10B981', marginRight: '4px' }} />{item.status}</span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Send Broadcast Message"
        open={isModalVisible}
        onOk={handleSend}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter broadcast title" />
          </Form.Item>
          <Form.Item name="type" label="Message Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="emergency">Emergency</Select.Option>
              <Select.Option value="clinical">Clinical</Select.Option>
              <Select.Option value="administrative">Administrative</Select.Option>
              <Select.Option value="system">System</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetAudience" label="Target Audience" rules={[{ required: true }]}>
            <Select placeholder="Select audience">
              <Select.Option value="all">All Staff</Select.Option>
              <Select.Option value="clinical">Clinical Staff</Select.Option>
              <Select.Option value="administrative">Administrative Staff</Select.Option>
              <Select.Option value="management">Management</Select.Option>
              <Select.Option value="department">Specific Department</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department (if applicable)">
            <Select placeholder="Select department">
              <Select.Option value="cardiology">Cardiology</Select.Option>
              <Select.Option value="nursing">Nursing</Select.Option>
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter your broadcast message" />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority" defaultValue="normal">
              <Select.Option value="urgent">Urgent - Send immediately</Select.Option>
              <Select.Option value="normal">Normal - Send within 1 hour</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="channels" label="Notification Channels">
            <Select mode="multiple" defaultValue={['in-app', 'email']}>
              <Select.Option value="in-app">In-App Notification</Select.Option>
              <Select.Option value="email">Email</Select.Option>
              <Select.Option value="sms">SMS</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
