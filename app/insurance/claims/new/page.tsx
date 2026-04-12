'use client';

import React, { useState } from 'react';
import { App, Card, Form, Input, Select, DatePicker, Row, Col, Button, Divider, Typography, Space, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function NewClaimPage() {
  const router = useRouter();
  const { message: appMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      appMessage.success('Insurance claim submitted successfully!');
      router.push('/insurance/claims');
    } catch (error) {
      appMessage.error('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/insurance/claims');
  };

  return (
    <PageShell
      title="Submit New Claim"
      subtitle="File a new insurance claim for processed services"
    >
      <Card className="-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ claimDate: new Date() }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Claim Number"
                name="claimNumber"
                rules={[{ required: true, message: 'Please enter claim number' }]}
              >
                <Input placeholder="e.g., CLM-2024-0001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Claim Date"
                name="claimDate"
                rules={[{ required: true, message: 'Please select claim date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Patient Information</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Patient Name"
                name="patientName"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input placeholder="Enter patient full name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Policy Number"
                name="policyNumber"
                rules={[{ required: true, message: 'Please enter policy number' }]}
              >
                <Input placeholder="e.g., POL-123456" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Service Details</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Service Date"
                name="serviceDate"
                rules={[{ required: true, message: 'Please select service date' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Service Provider"
                name="provider"
                rules={[{ required: true, message: 'Please enter provider name' }]}
              >
                <Input placeholder="Enter service provider" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Diagnosis/Procedure"
                name="diagnosis"
                rules={[{ required: true, message: 'Please enter diagnosis' }]}
              >
                <Input placeholder="Enter diagnosis or procedure code" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Amount (NGN)"
                name="amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <Input type="number" placeholder="Enter claim amount" prefix="₦" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Insurance Information</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Insurance Provider"
                name="provider"
                rules={[{ required: true, message: 'Please select insurance provider' }]}
              >
                <Select placeholder="Select insurance provider">
                  <Option value="leadway">Leadway Assurance</Option>
                  <Option value="aiico">AIICO Insurance</Option>
                  <Option value="custodian">Custodian Insurance</Option>
                  <Option value="niger">Niger Insurance</Option>
                  <Option value="royal">Royal Exchange</Option>
                  <Option value="anchor">Anchor Insurance</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Claim Type"
                name="claimType"
                rules={[{ required: true, message: 'Please select claim type' }]}
              >
                <Select placeholder="Select claim type">
                  <Option value="inpatient">Inpatient</Option>
                  <Option value="outpatient">Outpatient</Option>
                  <Option value="maternity">Maternity</Option>
                  <Option value="dental">Dental</Option>
                  <Option value="optical">Optical</Option>
                  <Option value="prescription">Prescription</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <TextArea rows={4} placeholder="Enter any additional notes or comments" />
          </Form.Item>

          <Form.Item>
            <Space className=" justify-end">
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                Submit Claim
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageShell>
  );
}
