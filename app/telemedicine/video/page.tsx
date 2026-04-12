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
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2]    ">
        <Card className="max-w-3xl w-full text-center">
          <Title level={3} className="">
            Video Consultation
          </Title>

          <div className="w-full h-[400px] bg-black -lg    ">
            <div className=" text-center">
              <div className="text-[48px] ">[Video Call]</div>
              <div>Dr. Ngozi Adeleke</div>
              <div className=" ">Connecting...</div>
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
    <div className="  sm: sm: lg: lg: max-w-3xl mx-auto">
      <Title level={2}>Telemedicine Consultation</Title>
      <Text type="secondary">Connect with your doctor via video call</Text>

      <Alert
        title="Prepare for Your Consultation"
        description="Ensure you have a stable internet connection and your camera/microphone are working properly."
        type="info"
        showIcon
        className=""
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
              <Select.Option value="d1">Dr. Ngozi Adeleke - Cardiology</Select.Option>
              <Select.Option value="d2">Dr. Emeka Okoro - General Medicine</Select.Option>
              <Select.Option value="d3">Dr. Tunde Bakare - Orthopedics</Select.Option>
              <Select.Option value="d4">Dr. Aisha Yusuf - Pediatrics</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="date" label="Preferred Date" rules={[{ required: true }]}>
                <DatePicker className="w-full" size="large" />
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

      <Card className="">
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
                <CheckCircleOutlined className="color: '#10B981' " />
              {item}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
