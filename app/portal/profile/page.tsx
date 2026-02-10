'use client';

import React from 'react';
import { Card, Form, Input, Button, Row, Col, App, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

export default function PortalProfilePage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleUpdate = async (values: { [key: string]: string | number }) => {
    message.success('Profile updated successfully!');
  };

  const handlePasswordChange = async (values: { [key: string]: string | number }) => {
    message.success('Password changed successfully!');
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Avatar size={100} icon={<UserOutlined />} className="bg-blue-600 mb-4" />
            <h3 className="text-xl font-semibold">John Smith</h3>
            <p className="text-gray-500">MRN-2024-0001</p>
            <div className="mt-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <MailOutlined className="text-gray-400" />
                <span>john.smith@email.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-gray-400" />
                <span>+1-555-0101</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card title="Personal Information" className="mb-4 p-4 sm:p-6">
            <Form layout="vertical" onFinish={handleUpdate} initialValues={{ firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phone: '+1-555-0101' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input.TextArea rows={2} placeholder="Your address" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Update Profile</Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Change Password">
            <Form layout="vertical" onFinish={handlePasswordChange}>
              <Form.Item label="Current Password" name="currentPassword" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item label="New Password" name="newPassword" rules={[{ required: true, min: 8 }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item label="Confirm New Password" name="confirmPassword" rules={[{ required: true }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Change Password</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
