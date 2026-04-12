'use client';

import React, { useState } from 'react';
import { App, Card, Form, Input, Select, DatePicker, Row, Col, Button, Divider, Typography, Space, InputNumber, message } from 'antd';
import { SaveOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function NewPreAuthPage() {
  const router = useRouter();
  const { message: appMessage } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      appMessage.success('Pre-authorization request submitted successfully!');
      router.push('/insurance/pre-auth');
    } catch (error) {
      appMessage.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/insurance/pre-auth');
  };

  return (
    <PageShell
      title="Request Pre-Authorization"
      subtitle="Submit a pre-authorization request for medical services"
      icon={<FileTextOutlined />}
    >
      <Card className="-xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ requestDate: new Date() }}
        >
          <Divider orientation="left">Request Information</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Request Number"
                name="requestNumber"
                rules={[{ required: true, message: 'Please enter request number' }]}
              >
                <Input placeholder="e.g., PRE-AUTH-2024-0001" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Request Date"
              name="requestDate"
              rules={[{ required: true, message: 'Please select request date' }]}
            >
              <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Patient Information</Divider>

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
                <Input placeholder="Enter policy number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Insurance Provider"
                name="insuranceProvider"
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
                label="Enrollee ID"
                name="enrolleeId"
                rules={[{ required: true, message: 'Please enter enrollee ID' }]}
              >
                <Input placeholder="Enter enrollee ID" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Service Details</Divider>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Treatment Type"
                name="treatmentType"
                rules={[{ required: true, message: 'Please select treatment type' }]}
              >
                <Select placeholder="Select treatment type">
                  <Option value="consultation">Consultation</Option>
                  <Option value="diagnostic">Diagnostic Test</Option>
                  <Option value="surgery">Surgery</Option>
                  <Option value="hospitalization">Hospitalization</Option>
                  <Option value="maternity">Maternity Care</Option>
                  <Option value="dental">Dental Procedure</Option>
                  <Option value="optical">Optical Treatment</Option>
                  <Option value="physiotherapy">Physiotherapy</Option>
                  <Option value="prescription">Prescription Drug</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Urgency Level"
                name="urgency"
                rules={[{ required: true, message: 'Please select urgency level' }]}
              >
                <Select placeholder="Select urgency level">
                  <Option value="routine">Routine</Option>
                  <Option value="urgent">Urgent</Option>
                  <Option value="emergency">Emergency</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Proposed Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Expected Duration (Days)"
                name="duration"
              >
                <InputNumber min={1} max={365} className="w-full" placeholder="Enter duration" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Clinical Information</Divider>

          <Form.Item
            label="Diagnosis/Complaint"
            name="diagnosis"
            rules={[{ required: true, message: 'Please enter diagnosis' }]}
          >
            <TextArea rows={3} placeholder="Enter diagnosis or presenting complaint" />
          </Form.Item>

          <Form.Item
            label="Proposed Treatment/Procedure"
            name="treatment"
            rules={[{ required: true, message: 'Please enter proposed treatment' }]}
          >
            <TextArea rows={3} placeholder="Describe the proposed treatment or procedure" />
          </Form.Item>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Estimated Cost (NGN)"
                name="estimatedCost"
                rules={[{ required: true, message: 'Please enter estimated cost' }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Enter estimated cost"
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Attending Physician"
                name="physician"
                rules={[{ required: true, message: 'Please enter physician name' }]}
              >
                <Input placeholder="Enter physician name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <TextArea rows={4} placeholder="Enter any additional clinical notes or justification" />
          </Form.Item>

          <Form.Item>
            <Space className=" justify-end">
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                Submit Pre-Authorization
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageShell>
  );
}
