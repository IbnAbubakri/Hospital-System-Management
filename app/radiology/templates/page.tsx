'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Input, Modal, Form, Select, App } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RadiologyTemplatesPage() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = React.useState('');

  const templates = [
    { id: 1, name: 'Chest X-Ray Standard', modality: 'X-Ray', views: 'PA, Lateral', bodyPart: 'Chest', status: 'Active', lastModified: '2024-01-20' },
    { id: 2, name: 'CT Abdomen Protocol', modality: 'CT', views: 'Axial, Coronal, Sagittal', bodyPart: 'Abdomen', status: 'Active', lastModified: '2024-01-18' },
    { id: 3, name: 'MRI Brain Standard', modality: 'MRI', views: 'T1, T2, FLAIR, DWI', bodyPart: 'Brain', status: 'Active', lastModified: '2024-01-22' },
    { id: 4, name: 'X-Ray Extremity', modality: 'X-Ray', views: 'AP, Lateral, Oblique', bodyPart: 'Extremities', status: 'Active', lastModified: '2024-01-15' },
    { id: 5, name: 'Ultrasound Abdomen', modality: 'Ultrasound', views: 'Grayscale, Color Doppler', bodyPart: 'Abdomen', status: 'Active', lastModified: '2024-01-10' },
    { id: 6, name: 'CT Chest Protocol', modality: 'CT', views: 'Axial, Coronal, MIP', bodyPart: 'Chest', status: 'Active', lastModified: '2024-01-25' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Template Name', dataIndex: 'name', key: 'name' },
    { title: 'Modality', dataIndex: 'modality', key: 'modality', render: (mod: string) => <Tag color="purple">{mod}</Tag> },
    { title: 'Views', dataIndex: 'views', key: 'views' },
    { title: 'Body Part', dataIndex: 'bodyPart', key: 'bodyPart' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="success">{status}</Tag> },
    { title: 'Last Modified', dataIndex: 'lastModified', key: 'lastModified' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
        </Space>
      )},
  ];

  const handleCreate = () => {
    form.validateFields().then((values) => {
      message.success('Radiology template created successfully');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchText.toLowerCase()) ||
    t.modality.toLowerCase().includes(searchText.toLowerCase()) ||
    t.bodyPart.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Radiology Procedure Templates</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Template
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input.Search
            placeholder="Search templates..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
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
        title="Create Radiology Template"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input placeholder="Enter template name" />
          </Form.Item>
          <Form.Item name="modality" label="Modality" rules={[{ required: true }]}>
            <Select placeholder="Select modality">
              <Select.Option value="X-Ray">X-Ray</Select.Option>
              <Select.Option value="CT">CT</Select.Option>
              <Select.Option value="MRI">MRI</Select.Option>
              <Select.Option value="Ultrasound">Ultrasound</Select.Option>
              <Select.Option value="Mammography">Mammography</Select.Option>
              <Select.Option value="Fluoroscopy">Fluoroscopy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="bodyPart" label="Body Part" rules={[{ required: true }]}>
            <Select placeholder="Select body part">
              <Select.Option value="Chest">Chest</Select.Option>
              <Select.Option value="Abdomen">Abdomen</Select.Option>
              <Select.Option value="Brain">Brain</Select.Option>
              <Select.Option value="Spine">Spine</Select.Option>
              <Select.Option value="Extremities">Extremities</Select.Option>
              <Select.Option value="Pelvis">Pelvis</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="views" label="Views (comma separated)" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add views">
              <Select.Option value="PA">PA (Posteroanterior)</Select.Option>
              <Select.Option value="Lateral">Lateral</Select.Option>
              <Select.Option value="AP">AP (Anteroposterior)</Select.Option>
              <Select.Option value="Oblique">Oblique</Select.Option>
              <Select.Option value="Axial">Axial</Select.Option>
              <Select.Option value="Coronal">Coronal</Select.Option>
              <Select.Option value="Sagittal">Sagittal</Select.Option>
              <Select.Option value="T1">T1 Weighted</Select.Option>
              <Select.Option value="T2">T2 Weighted</Select.Option>
              <Select.Option value="FLAIR">FLAIR</Select.Option>
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
