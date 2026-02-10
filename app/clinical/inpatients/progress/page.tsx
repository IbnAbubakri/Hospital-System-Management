'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Row, Col, Typography, Button, Form, Input, Select, DatePicker, Space, List, Tag, Avatar, Empty, Alert, Tabs, Divider, App } from 'antd';
import { PlusOutlined, UserOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProgressNote {
  id: string;
  patientId: string;
  date: string;
  time: string;
  noteType: 'Physician' | 'Nursing' | 'Therapy' | 'Consultation';
  author: string;
  subject: string;
  content: string;
  followUpRequired: boolean;
  severity: 'Routine' | 'Urgent' | 'Critical';
}

export default function ProgressNotesPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const accessiblePatients = useMemo(() => {
    if (!user) return [];
    return filterPatientsByUser(user);
  }, [user]);

  const patient = accessiblePatients.find((p: any) => p.id === params.id) as any;

  if (!patient) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Title level={3}>Access Denied</Title>
        <Text>Patient not found or you do not have permission to view this page.</Text>
        <br />
        <Button type="primary" onClick={() => router.back()} style={{ marginTop: '16px' }}>
          Go Back
        </Button>
      </div>
    );
  }

  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([
    {
      id: '1',
      patientId: patient.id,
      date: '2024-02-02',
      time: '09:00',
      noteType: 'Physician',
      author: 'Dr. Emeka Adeleke',
      subject: 'Blood Pressure Response',
      content: 'Patient showing good response to current antihypertensive regimen. BP stable at 130/85. No adverse effects reported. Continue current medication.',
      followUpRequired: true,
      severity: 'Routine'},
    {
      id: '2',
      patientId: patient.id,
      date: '2024-02-01',
      time: '14:30',
      noteType: 'Nursing',
      author: 'Nurse Amaka Okafor',
      subject: 'Vital Signs Monitoring',
      content: 'Patient vitals stable throughout the shift. Temperature 37.2°C, BP 128/82, HR 76 bpm. No complaints of pain or discomfort. Diet tolerance good.',
      followUpRequired: false,
      severity: 'Routine'},
    {
      id: '3',
      patientId: patient.id,
      date: '2024-02-01',
      time: '08:00',
      noteType: 'Physician',
      author: 'Dr. Ibrahim Musa',
      subject: 'Morning Rounds',
      content: 'Patient reports feeling well. No new symptoms. Medication compliance confirmed. Plan for discharge tomorrow pending final vitals assessment.',
      followUpRequired: true,
      severity: 'Routine'},
    {
      id: '4',
      patientId: patient.id,
      date: '2024-01-31',
      time: '22:00',
      noteType: 'Nursing',
      author: 'Nurse Grace Adebayo',
      subject: 'Evening Assessment',
      content: 'Patient resting comfortably. Complains of mild headache at 20:00, given paracetamol 500mg. Symptom resolved. Sleep quality good.',
      followUpRequired: false,
      severity: 'Routine'},
  ]);

  const handleSubmit = (values: { [key: string]: string | number }) => {
    const newNote: ProgressNote = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: dayjs().format('YYYY-MM-DD'),
      time: dayjs().format('HH:mm'),
      noteType: values.noteType as any,
      author: user ? `Dr. ${user.firstName} ${user.lastName}` : 'Doctor',
      subject: values.subject as string,
      content: values.content as string,
      followUpRequired: Boolean(values.followUpRequired),
      severity: (values.severity || 'Routine') as any};

    setProgressNotes([newNote, ...progressNotes]);
    setIsAdding(false);
    form.resetFields();
    message.success('Progress note added successfully');
  };

  const getNoteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Physician': 'blue',
      'Nursing': 'green',
      'Therapy': 'orange',
      'Consultation': 'purple'};
    return colors[type] || 'default';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      'Routine': 'green',
      'Urgent': 'orange',
      'Critical': 'red'};
    return colors[severity] || 'default';
  };

  const filteredNotes = useMemo(() => {
    if (activeTab === 'all') return progressNotes;
    if (activeTab === 'follow-up') return progressNotes.filter((n: any) => n.followUpRequired);
    return progressNotes.filter((n: any) => n.noteType.toLowerCase() === activeTab);
  }, [progressNotes, activeTab]);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Progress Notes`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Space>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => setIsAdding(true)}>
              Add Note
            </Button>
            <Button onClick={() => router.push(`/patients/${patient.id}`)}>Back to Patient</Button>
          </Space>
        }
      />

      {isAdding && (
        <Card title="New Progress Note" style={{ marginBottom: '24px' }}>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="noteType" label="Note Type" rules={[{ required: true }]}>
                  <Select placeholder="Select note type">
                    <Option value="Physician">Physician</Option>
                    <Option value="Nursing">Nursing</Option>
                    <Option value="Therapy">Therapy</Option>
                    <Option value="Consultation">Consultation</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="severity" label="Severity" rules={[{ required: true }]}>
                  <Select placeholder="Select severity">
                    <Option value="Routine">Routine</Option>
                    <Option value="Urgent">Urgent</Option>
                    <Option value="Critical">Critical</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Input placeholder="Brief summary of the note" />
            </Form.Item>

            <Form.Item name="content" label="Detailed Note" rules={[{ required: true }]}>
              <TextArea rows={6} placeholder="Enter detailed progress note..." />
            </Form.Item>

            <Form.Item name="followUpRequired" valuePropName="checked">
              <Select placeholder="Follow-up Required?" defaultValue={false}>
                <Option value={false}>No</Option>
                <Option value={true}>Yes</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  Save Note
                </Button>
                <Button onClick={() => { setIsAdding(false); form.resetFields(); }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Card
        title={
          <Space>
            <span>Progress Notes</span>
            <Tag>{progressNotes.length} total</Tag>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All Notes (${progressNotes.length})` },
            { key: 'Physician', label: 'Physician' },
            { key: 'Nursing', label: 'Nursing' },
            { key: 'Therapy', label: 'Therapy' },
            { key: 'Consultation', label: 'Consultation' },
            { key: 'follow-up', label: 'Follow-up Required' },
          ]}
        />

        <Divider />

        {filteredNotes.length > 0 ? (
          <List
            dataSource={filteredNotes}
            renderItem={(note) => (
              <List.Item
                style={{
                  borderLeft: `3px solid ${note.severity === 'Critical' ? '#DC2626' : note.severity === 'Urgent' ? '#F59E0B' : '#D1D5DB'}`,
                  paddingLeft: '16px',
                  background: note.severity === 'Critical' || note.severity === 'Urgent' ? '#FEF2F2' : 'transparent',
                  marginBottom: '16px',
                  borderRadius: '8px'}}
                actions={[
                  <Button type="text" icon={<EditOutlined />} size="small" />,
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        background: note.noteType === 'Physician' ? '#3B82F6' : '#10B981'}}
                    />
                  }
                  title={
                    <Space>
                      <span className="font-medium">{note.subject}</span>
                      <Tag color={getNoteTypeColor(note.noteType)}>{note.noteType}</Tag>
                      <Tag color={getSeverityColor(note.severity)}>{note.severity}</Tag>
                      {note.followUpRequired && (
                        <Tag color="orange">Follow-up Required</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                        <Space size="middle">
                          <span><CalendarOutlined /> {note.date}</span>
                          <span>{note.time}</span>
                          <span>{note.author}</span>
                        </Space>
                      </div>
                      <Text className="text-sm">{note.content}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No progress notes found" />
        )}
      </Card>
    </div>
  );
}
