'use client';

import React from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, Typography, Divider, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface EMRFormProps {
  patientName: string;
  patientId: string;
  onSubmit?: (values: { [key: string]: string | number }) => void;
}

export function EMRForm({ patientName, patientId, onSubmit }: EMRFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = (values: { [key: string]: string | number }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {/* Patient Info */}
      <Card className="mb-4" size="small">
        <Space orientation="vertical" className="w-full">
          <Title level={5} className="!mb-0">Patient Information</Title>
          <div>Patient: <strong>{patientName}</strong> (ID: {patientId})</div>
        </Space>
      </Card>

      {/* Chief Complaint */}
      <Card title="Chief Complaint" className="mb-4" size="small">
        <Form.Item
          name="chiefComplaint"
          rules={[{ required: true, message: 'Please enter chief complaint' }]}
        >
          <TextArea rows={3} placeholder="Enter chief complaint" />
        </Form.Item>
      </Card>

      {/* Present Illness */}
      <Card title="History of Present Illness" className="mb-4" size="small">
        <Form.Item
          name="presentIllness"
          rules={[{ required: true, message: 'Please enter history of present illness' }]}
        >
          <TextArea rows={4} placeholder="Enter details about present illness" />
        </Form.Item>
      </Card>

      {/* Vital Signs */}
      <Card title="Vital Signs" className="mb-4" size="small">
        <Row gutter={16}>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Temperature (°C)" name={['vitals', 'temperature']}>
              <Input type="number" step="0.1" placeholder="37.0" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Pulse (bpm)" name={['vitals', 'pulse']}>
              <Input type="number" placeholder="72" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Systolic BP" name={['vitals', 'bpSystolic']}>
              <Input type="number" placeholder="120" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Diastolic BP" name={['vitals', 'bpDiastolic']}>
              <Input type="number" placeholder="80" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Resp. Rate" name={['vitals', 'respiratoryRate']}>
              <Input type="number" placeholder="16" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="SpO2 (%)" name={['vitals', 'spo2']}>
              <Input type="number" placeholder="98" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Height (cm)" name={['vitals', 'height']}>
              <Input type="number" placeholder="170" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Form.Item label="Weight (kg)" name={['vitals', 'weight']}>
              <Input type="number" step="0.1" placeholder="70" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Physical Examination */}
      <Card title="Physical Examination" className="mb-4" size="small">
        <Form.Item label="General" name={['physicalExam', 'general']}>
          <TextArea rows={2} placeholder="General appearance" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="HEENT" name={['physicalExam', 'heent']}>
              <TextArea rows={2} placeholder="Head, Eyes, Ears, Nose, Throat" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Cardiovascular" name={['physicalExam', 'cardiovascular']}>
              <TextArea rows={2} placeholder="Heart sounds, murmurs" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Respiratory" name={['physicalExam', 'respiratory']}>
              <TextArea rows={2} placeholder="Lungs, breathing" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Abdomen" name={['physicalExam', 'abdomen']}>
              <TextArea rows={2} placeholder="Abdominal examination" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Diagnosis */}
      <Card title="Diagnosis" className="mb-4" size="small">
        <Form.List name="diagnoses">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="w-full mb-2" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'code']}
                    rules={[{ required: true, message: 'ICD code required' }]}
                    className="flex-1 mb-0"
                  >
                    <Input placeholder="ICD-10 Code" style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[{ required: true, message: 'Description required' }]}
                    className="flex-1 mb-0"
                  >
                    <Input placeholder="Description" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'type']}
                    initialValue="primary"
                    className="mb-0"
                  >
                    <Select style={{ width: 120 }}>
                      <Option value="primary">Primary</Option>
                      <Option value="secondary">Secondary</Option>
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Diagnosis
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Treatment Plan */}
      <Card title="Treatment Plan" className="mb-4" size="small">
        <Form.Item name="treatmentPlan" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Enter treatment plan" />
        </Form.Item>
      </Card>

      {/* Investigations */}
      <Card title="Investigations Ordered" className="mb-4" size="small">
        <Form.List name="investigations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="w-full mb-2" align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'type']}
                    initialValue="lab"
                  >
                    <Select style={{ width: 100 }}>
                      <Option value="lab">Lab</Option>
                      <Option value="radiology">Radiology</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'test']}
                    rules={[{ required: true }]}
                    className="flex-1 mb-0"
                  >
                    <Input placeholder="Test name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'urgency']}
                    initialValue="routine"
                  >
                    <Select style={{ width: 120 }}>
                      <Option value="routine">Routine</Option>
                      <Option value="urgent">Urgent</Option>
                      <Option value="emergency">Emergency</Option>
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Investigation
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Follow-up */}
      <Card className="mb-4" size="small">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Follow-up Date" name="followUpDate">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Notes" name="notes">
              <Input placeholder="Additional notes" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" size="large" block>
          Save EMR
        </Button>
      </Form.Item>
    </Form>
  );
}
