'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Space, Image, Descriptions } from 'antd';
import { FileTextOutlined, DownloadOutlined, ZoomInOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LabViewerPage() {
  const [selectedResult, setSelectedResult] = React.useState<any>(null);

  const results = [
    {
      id: 'LAB-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      test: 'Complete Blood Count',
      date: '2024-02-05',
      collected: '2024-02-05 08:30',
      reported: '2024-02-05 10:15',
      status: 'Final',
      department: 'Hematology',
      hasImage: true,
    },
    {
      id: 'LAB-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      test: 'Peripheral Blood Smear',
      date: '2024-02-04',
      collected: '2024-02-04 14:20',
      reported: '2024-02-04 16:00',
      status: 'Final',
      department: 'Hematology',
      hasImage: true,
    },
    {
      id: 'LAB-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      test: 'Malaria Parasite',
      date: '2024-02-03',
      collected: '2024-02-03 10:00',
      reported: '2024-02-03 11:30',
      status: 'Final',
      department: 'Parasitology',
      hasImage: true,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Lab Results Viewer</Title>

      <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 150px)' }}>
        <Card title="Recent Results with Images" style={{ width: '400px', overflowY: 'auto' }}>
          <List
            dataSource={results}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedResult(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedResult?.id === item.id ? '#e6f7ff' : 'transparent',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                  title={
                    <div className="flex justify-between items-center">
                      <span>{item.test}</span>
                      <Tag color="success">{item.status}</Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div>{item.patient} ({item.mrn})</div>
                      <div className="text-xs text-gray-500">{item.date} • {item.department}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title={selectedResult ? `Result: ${selectedResult.test}` : 'Select a result to view'}
          style={{ flex: 1 }}
        >
          {selectedResult ? (
            <div>
              <Descriptions column={2} bordered size="small" style={{ marginBottom: '16px' }}>
                <Descriptions.Item label="Lab ID">{selectedResult.id}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color="success">{selectedResult.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Patient">{selectedResult.patient}</Descriptions.Item>
                <Descriptions.Item label="MRN">{selectedResult.mrn}</Descriptions.Item>
                <Descriptions.Item label="Test">{selectedResult.test}</Descriptions.Item>
                <Descriptions.Item label="Department">{selectedResult.department}</Descriptions.Item>
                <Descriptions.Item label="Collected">{selectedResult.collected}</Descriptions.Item>
                <Descriptions.Item label="Reported">{selectedResult.reported}</Descriptions.Item>
              </Descriptions>

              <Title level={5}>Microscopic Images</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div>
                  <div className="text-center mb-2">Blood Smear - Low Power (10x)</div>
                  <div style={{ backgroundColor: '#f5f5f5', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  </div>
                  <Space className="mt-2">
                    <Button size="small" icon={<ZoomInOutlined />}>Zoom</Button>
                    <Button size="small" icon={<DownloadOutlined />}>Download</Button>
                  </Space>
                </div>

                <div>
                  <div className="text-center mb-2">Blood Smear - High Power (40x)</div>
                  <div style={{ backgroundColor: '#f5f5f5', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  </div>
                  <Space className="mt-2">
                    <Button size="small" icon={<ZoomInOutlined />}>Zoom</Button>
                    <Button size="small" icon={<DownloadOutlined />}>Download</Button>
                  </Space>
                </div>

                <div>
                  <div className="text-center mb-2">Cell Morphology Detail (100x)</div>
                  <div style={{ backgroundColor: '#f5f5f5', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  </div>
                  <Space className="mt-2">
                    <Button size="small" icon={<ZoomInOutlined />}>Zoom</Button>
                    <Button size="small" icon={<DownloadOutlined />}>Download</Button>
                  </Space>
                </div>
              </div>

              <Card size="small" title="Technician Notes" className="mt-4">
                <p>RBCs show normocytic normochemic morphology. WBC differential within normal limits. Platelets adequate in number. No abnormal cells detected.</p>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileTextOutlined style={{ fontSize: '64px' }} />
                <p className="mt-4">Select a lab result to view images</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
