'use client';

import React, { useState } from 'react';
import { App, Card, Form, Input, Select, Row, Col, Button, Divider, Typography, Space, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function NewPartnerPage() {
  const router = useRouter();
  const { message: appMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      appMessage.success('Insurance partner added successfully!');
      router.push('/insurance/partners');
    } catch (error) {
      appMessage.error('Failed to add partner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/insurance/partners');
  };

  return (
    <PageShell
      title="Add New Insurance Partner"
      subtitle="Register a new insurance company partnership"
    >
      <Card className="-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: true, message: 'Please enter company name' }]}
              >
                <Input placeholder="Enter insurance company name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Contact Person"
                name="contactPerson"
                rules={[{ required: true, message: 'Please enter contact person' }]}
              >
                <Input placeholder="Enter contact person name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Address</Divider>

          <Form.Item
            label="Street Address"
            name="address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please select state' }]}
              >
                <Select placeholder="Select state">
                  <Option value="Lagos">Lagos</Option>
                  <Option value="Abuja">Abuja (FCT)</Option>
                  <Option value="Rivers">Rivers</Option>
                  <Option value="Kano">Kano</Option>
                  <Option value="Oyo">Oyo</Option>
                  <Option value="Kaduna">Kaduna</Option>
                  <Option value="Enugu">Enugu</Option>
                  <Option value="Anambra">Anambra</Option>
                  <Option value="Delta">Delta</Option>
                  <Option value="Ogun">Ogun</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Postal Code"
                name="postalCode"
              >
                <Input placeholder="Enter postal code" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Partnership Details</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Agreement Type"
                name="agreementType"
                rules={[{ required: true, message: 'Please select agreement type' }]}
              >
                <Select placeholder="Select agreement type">
                  <Option value="hmo">HMO Provider</Option>
                  <Option value="insurance">Insurance Company</Option>
                  <Option value="corporate">Corporate Client</Option>
                  <Option value="government">Government Scheme</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Status"
                name="status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Coverage Plans"
            name="coveragePlans"
          >
            <Select mode="multiple" placeholder="Select coverage plans">
              <Option value="inpatient">Inpatient Care</Option>
              <Option value="outpatient">Outpatient Care</Option>
              <Option value="maternity">Maternity Care</Option>
              <Option value="dental">Dental Care</Option>
              <Option value="optical">Optical Care</Option>
              <Option value="prescription">Prescription Drugs</Option>
              <Option value="emergency">Emergency Services</Option>
              <Option value="preventive">Preventive Care</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <TextArea rows={4} placeholder="Enter any additional notes" />
          </Form.Item>

          <Form.Item>
            <Space className=" justify-end">
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                Add Partner
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageShell>
  );
}
