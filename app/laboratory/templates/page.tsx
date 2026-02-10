'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Input, Modal, Form, Select, App } from 'antd';
import { PlusOutlined, EditOutlined, CopyOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LabTemplatesPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');

  const templates = [
    { id: 1, name: 'Admission Profile', category: 'General', tests: 'CBC, FBS, U/E/Cr, LFT, Lipid Profile', status: 'Active', lastModified: '2024-01-20', modifiedBy: 'Dr. Okonkwo' },
    { id: 2, name: 'Diabetes Screening', category: 'Endocrinology', tests: 'FBS, HbA1c, Urinalysis', status: 'Active', lastModified: '2024-01-18', modifiedBy: 'Dr. Eze' },
    { id: 3, name: 'Hypertension Workup', category: 'Cardiology', tests: 'CBC, FBS, U/E/Cr, LFT, Lipid Profile, Urinalysis, ECG', status: 'Active', lastModified: '2024-01-22', modifiedBy: 'Dr. Okonkwo' },
    { id: 4, name: 'Antenatal Profile', category: 'Obstetrics', tests: 'CBC, Hb genotype, VDRL, Hepatitis B, HIV, Urinalysis', status: 'Active', lastModified: '2024-01-15', modifiedBy: 'Dr. Okafor' },
    { id: 5, name: 'Pre-Employment', category: 'General', tests: 'CBC, Urinalysis, Hb genotype, HIV, Hepatitis B, Chest X-ray', status: 'Active', lastModified: '2024-01-10', modifiedBy: 'Dr. Nnamdi' },
    { id: 6, name: 'Liver Function Test', category: 'Gastroenterology', tests: 'Total Bilirubin, Direct Bilirubin, ALT, AST, ALP, Total Protein, Albumin', status: 'Active', lastModified: '2024-01-25', modifiedBy: 'Dr. Eze' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Template Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag color="blue">{cat}</Tag> },
    { title: 'Tests Included', dataIndex: 'tests', key: 'tests' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
    { title: 'Modified By', dataIndex: 'modifiedBy', key: 'modifiedBy' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" size="small" icon={<CopyOutlined />}>Duplicate</Button>
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Lab template created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchText.toLowerCase()) ||
    t.category.toLowerCase().includes(searchText.toLowerCase()) ||
    t.tests.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <Title level={3}>Lab Test Templates</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="w-full sm:w-auto">
          Create Template
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4">
          <Input.Search
            placeholder="Search templates..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full sm:w-auto"
          />
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={filteredTemplates}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      <Modal
        title="Create Lab Template"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input placeholder="Enter template name" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Select.Option value="general">General</Select.Option>
              <Select.Option value="cardiology">Cardiology</Select.Option>
              <Select.Option value="endocrinology">Endocrinology</Select.Option>
              <Select.Option value="gastroenterology">Gastroenterology</Select.Option>
              <Select.Option value="obstetrics">Obstetrics</Select.Option>
              <Select.Option value="pediatrics">Pediatrics</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="tests" label="Tests Included" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Select or add tests">
              <Select.Option value="CBC">Complete Blood Count (CBC)</Select.Option>
              <Select.Option value="FBS">Fasting Blood Sugar (FBS)</Select.Option>
              <Select.Option value="RBS">Random Blood Sugar (RBS)</Select.Option>
              <Select.Option value="HbA1c">HbA1c</Select.Option>
              <Select.Option value="UECr">Urea/Electrolytes/Creatinine</Select.Option>
              <Select.Option value="LFT">Liver Function Test</Select.Option>
              <Select.Option value="Lipid">Lipid Profile</Select.Option>
              <Select.Option value="Urinalysis">Urinalysis</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
