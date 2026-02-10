'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Row, Col, Select, DatePicker, TimePicker, Tag, Alert, App, List } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function TelemedicinePage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [inCall, setInCall] = useState(false);

  const handleStartCall = (values: { [key: string]: string | number }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInCall(true);
    }, 1500);
  };

  const handleEndCall = () => {
    setInCall(false);
    message.success('Call ended successfully');
    router.push('/clinical/emr');
  };

  if (inCall) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Card style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>
            Video Consultation
          </Title>

          <div style={{
            width: '100%',
            height: '400px',
            background: '#000',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📹</div>
              <div>Dr. Emeka Adeleke</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>Connecting...</div>
            </div>
          </div>

          <Space size="large">
            <Button size="large" icon={<UserOutlined />}>Mute</Button>
            <Button size="large" danger onClick={handleEndCall}>End Call</Button>
            <Button size="large">Chat</Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Telemedicine Consultation</Title>
      <Text type="secondary">Connect with your doctor via video call</Text>

      <Alert
        title="Prepare for Your Consultation"
        description="Ensure you have a stable internet connection and your camera/microphone are working properly."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={handleStartCall}>
          <Form.Item
            name="appointmentType"
            label="Consultation Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select type" size="large">
              <Select.Option value="new">New Consultation</Select.Option>
              <Select.Option value="follow-up">Follow-up Visit</Select.Option>
              <Select.Option value="urgent">Urgent Consultation</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="doctor"
            label="Select Doctor"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select doctor" size="large">
              <Select.Option value="d1">Dr. Emeka Adeleke - Cardiology</Select.Option>
              <Select.Option value="d2">Dr. Ibrahim Musa - General Medicine</Select.Option>
              <Select.Option value="d3">Dr. Chinedu Okonkwo - Orthopedics</Select.Option>
              <Select.Option value="d4">Dr. Aisha Yusuf - Pediatrics</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Preferred Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="time" label="Preferred Time" rules={[{ required: true }]}>
                <Select placeholder="Select time slot" size="large">
                  <Select.Option value="09:00">09:00 AM</Select.Option>
                  <Select.Option value="10:00">10:00 AM</Select.Option>
                  <Select.Option value="11:00">11:00 AM</Select.Option>
                  <Select.Option value="14:00">02:00 PM</Select.Option>
                  <Select.Option value="15:00">03:00 PM</Select.Option>
                  <Select.Option value="16:00">04:00 PM</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="reason" label="Reason for Consultation" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe your symptoms or reason..." />
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <Input.TextArea rows={2} placeholder="Any additional information..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              icon={<CalendarOutlined />}
              block
            >
              Schedule Video Consultation
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>Before Your Call</Title>
        <List
          dataSource={[
            'Test your camera and microphone',
            'Find a quiet, well-lit location',
            'Have your medical records ready',
            'Write down your questions and symptoms',
            'Ensure stable internet connection',
          ]}
          renderItem={(item) => (
            <List.Item>
              <CheckCircleOutlined style={{ color: '#10B981', marginRight: '8px' }} />
              {item}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
