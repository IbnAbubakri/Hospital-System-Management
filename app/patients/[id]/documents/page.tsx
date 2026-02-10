'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Row, Col, Card, Upload, Button, Table, Tag, Typography, Space, Progress, Tooltip, Popconfirm, App } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, PlusOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/shared/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';
import { filterPatientsByUser } from '@/lib/dataFilters';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  category: 'Medical Report' | 'Lab Result' | 'Insurance' | 'ID Proof' | 'Other';
  status: 'Verified' | 'Pending';
}

export default function PatientDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const { user } = useAuth();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

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

  // Mock documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Blood_Test_Report.pdf',
      type: 'application/pdf',
      size: 1048576,
      uploadDate: '2024-01-25',
      uploadedBy: 'Dr. Emeka Adeleke',
      category: 'Lab Result',
      status: 'Verified'},
    {
      id: '2',
      name: 'Insurance_Card.jpg',
      type: 'image/jpeg',
      size: 524288,
      uploadDate: '2024-01-10',
      uploadedBy: 'Admin',
      category: 'Insurance',
      status: 'Verified'},
    {
      id: '3',
      name: 'National_ID.pdf',
      type: 'application/pdf',
      size: 786432,
      uploadDate: '2024-01-05',
      uploadedBy: patient.firstName,
      category: 'ID Proof',
      status: 'Verified'},
  ]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    beforeUpload: () => false};

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      message.success('Documents uploaded successfully');
      setFileList([]);
      setUploading(false);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc: any) => doc.id !== id));
    message.success('Document deleted successfully');
  };

  const columns = [
    {
      title: 'Document Name',
      key: 'name',
      render: (_: any, record: Document) => (
        <Space>
          <FileOutlined style={{ fontSize: '20px', color: '#3B82F6' }} />
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" className="text-xs">
              {record.type}
            </Text>
          </div>
        </Space>
      )},
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const colors: Record<string, string> = {
          'Medical Report': 'blue',
          'Lab Result': 'green',
          'Insurance': 'orange',
          'ID Proof': 'purple',
          'Other': 'default'};
        return <Tag color={colors[category]}>{category}</Tag>;
      }},
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => <span className="text-sm">{formatFileSize(size)}</span>},
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
      render: (uploadedBy: string) => <span className="text-sm">{uploadedBy}</span>},
    {
      title: 'Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      render: (date: string) => <span className="text-sm">{date}</span>},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Verified' ? 'success' : 'warning'}>{status}</Tag>
      )},
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} size="small" />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this document?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      )},
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName} - Documents`}
        subtitle={`MRN: ${patient.mrn}`}
        extra={
          <Button icon={<PlusOutlined />} onClick={() => router.push(`/patients/${patient.id}`)}>
            Back to Patient
          </Button>
        }
      />

      <Row gutter={[24, 24]}>
        {/* Upload Section */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CloudUploadOutlined style={{ color: '#3B82F6' }} />
                <span>Upload Documents</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Dragger {...uploadProps} style={{ marginBottom: '16px' }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: '48px', color: '#3B82F6' }} />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">Support for PDF, Images, DOCX files</p>
            </Dragger>

            <div className="mb-4">
              <Text type="secondary" className="text-sm">
                Supported file types: PDF, JPG, PNG, DOCX
              </Text>
              <br />
              <Text type="secondary" className="text-sm">
                Maximum file size: 10 MB
              </Text>
            </div>

            <div className="space-y-2 mb-4">
              <Text strong>Document Categories:</Text>
              <div className="flex flex-wrap gap-2">
                {['Medical Report', 'Lab Result', 'Insurance', 'ID Proof', 'Other'].map((cat) => (
                  <Tag key={cat}>{cat}</Tag>
                ))}
              </div>
            </div>

            {fileList.length > 0 && (
              <Progress
                percent={uploading ? 50 : 100}
                status={uploading ? 'active' : 'success'}
                className="mb-3"
              />
            )}

            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              block
            >
              Upload {fileList.length > 0 ? `(${fileList.length})` : ''}
            </Button>
          </Card>
        </Col>

        {/* Documents List */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <FileOutlined style={{ color: '#10B981' }} />
                <span>Document Repository</span>
                <Tag color="blue">{documents.length} documents</Tag>
              </Space>
            }
          >
            <Table
              dataSource={documents}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Storage Usage */}
      <Card style={{ marginTop: '24px' }}>
        <Title level={5}>Storage Usage</Title>
        <Progress
          percent={35}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068'}}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>3.5 MB used of 10 MB</span>
          <span>35%</span>
        </div>
      </Card>
    </div>
  );
}
