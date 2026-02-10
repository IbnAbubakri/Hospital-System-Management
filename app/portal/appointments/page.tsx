'use client';

import React from 'react';
import { Card, Form, Select, DatePicker, Button, Row, Col, App } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { mockDoctors } from '@/lib/mockData';

const { Option } = Select;

export default function PortalAppointmentsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleBook = async (values: { [key: string]: string | number }) => {
    message.success('Appointment request submitted!');
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>

      <Card className="p-4 sm:p-6">
        <Form layout="vertical" onFinish={handleBook}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Department" name="department" rules={[{ required: true }]}>
                <Select placeholder="Select department">
                  <Option value="Cardiology">Cardiology</Option>
                  <Option value="General Medicine">General Medicine</Option>
                  <Option value="Orthopedics">Orthopedics</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Doctor" name="doctorId" rules={[{ required: true }]}>
                <Select placeholder="Select doctor">
                  {mockDoctors.map((d) => (
                    <Option key={d.id} value={d.id}>
                      Dr. {d.firstName} {d.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Preferred Date" name="date" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Preferred Time" name="time" rules={[{ required: true }]}>
                <Select placeholder="Select time">
                  <Option value="09:00">09:00 AM</Option>
                  <Option value="10:00">10:00 AM</Option>
                  <Option value="11:00">11:00 AM</Option>
                  <Option value="14:00">02:00 PM</Option>
                  <Option value="15:00">03:00 PM</Option>
                  <Option value="16:00">04:00 PM</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Reason for Visit" name="reason" rules={[{ required: true }]}>
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">Select reason</option>
              <option value="consultation">General Consultation</option>
              <option value="followup">Follow-up Visit</option>
              <option value="checkup">Annual Checkup</option>
              <option value="other">Other</option>
            </select>
          </Form.Item>
          <Form.Item label="Additional Notes" name="notes">
            <textarea rows={3} className="w-full px-3 py-2 border rounded-md" placeholder="Any additional information" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<CalendarOutlined />} size="large" block>
              Book Appointment
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
