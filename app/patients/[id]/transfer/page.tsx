'use client';

import React from 'react';
import { Card, Form, Input, Button, Space, Typography, Select, Row, Col, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function PatientTransferPage() {
  const router = useRouter();
  const patient = { id: '1', name: 'Chukwuemeka Okonkwo', mrn: 'MRN-2024-0001' };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back to Patient
        </Button>
        <Title level={3} className="!mb-0">Transfer Patient</Title>
      </div>

      <Alert
        title="Patient Transfer"
        description={`Process transfer for ${patient.name} (${patient.mrn}) to another department or facility`}
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Transfer Type">
                <Select>
                  <Select.Option value="inter-department">Inter-Department</Select.Option>
                  <Select.Option value="inter-facility">Inter-Facility</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Transfer Priority">
                <Select>
                  <Select.Option value="routine">Routine</Select.Option>
                  <Select.Option value="urgent">Urgent</Select.Option>
                  <Select.Option value="critical">Critical</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Current Department" initialValue="Cardiology">
            <Input disabled value="Cardiology" />
          </Form.Item>

          <Form.Item label="Target Department/Facility" rules={[{ required: true }]}>
            <Select placeholder="Select destination">
              <Select.Option value="General Medicine">General Medicine</Select.Option>
              <Select.Option value="Orthopedics">Orthopedics</Select.Option>
              <Select.Option value="Pediatrics">Pediatrics</Select.Option>
              <Select.Option value="Neurology">Neurology</Select.Option>
              <Select.Option value="other">Other Hospital</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Reason for Transfer" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Explain why this patient needs to be transferred..." />
          </Form.Item>

          <Form.Item label="Transfer Notes">
            <Input.TextArea rows={2} placeholder="Additional notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary">Process Transfer</Button>
              <Button onClick={() => router.back()}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
