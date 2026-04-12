'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Button, Space, Descriptions, Modal } from 'antd';
import { FileTextOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function LabResultsPage() {
  const [selectedResult, setSelectedResult] = React.useState<any>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const results = [
    {
      id: 'LAB-2024-0892',
      test: 'Complete Blood Count (CBC)',
      date: '2024-02-05',
      orderedBy: 'Dr. Okonkwo',
      department: 'Hematology',
      status: 'Completed',
      critical: false,
      values: [
        { parameter: 'Hemoglobin', value: '13.5 g/dL', unit: 'g/dL', reference: '12.0-16.0', status: 'Normal' },
        { parameter: 'WBC', value: '7.5 x10^9/L', unit: 'x10^9/L', reference: '4.0-11.0', status: 'Normal' },
        { parameter: 'Platelets', value: '250 x10^9/L', unit: 'x10^9/L', reference: '150-400', status: 'Normal' },
      ],
    },
    {
      id: 'LAB-2024-0891',
      test: 'Fasting Blood Glucose',
      date: '2024-02-03',
      orderedBy: 'Dr. Nnamdi',
      department: 'Chemistry',
      status: 'Completed',
      critical: false,
      values: [
        { parameter: 'Glucose (Fasting)', value: '5.2 mmol/L', unit: 'mmol/L', reference: '3.9-6.1', status: 'Normal' },
      ],
    },
    {
      id: 'LAB-2024-0890',
      test: 'Lipid Profile',
      date: '2024-02-01',
      orderedBy: 'Dr. Okonkwo',
      department: 'Chemistry',
      status: 'Completed',
      critical: false,
      values: [
        { parameter: 'Total Cholesterol', value: '5.8 mmol/L', unit: 'mmol/L', reference: '< 5.2', status: 'High' },
        { parameter: 'HDL', value: '1.2 mmol/L', unit: 'mmol/L', reference: '> 1.0', status: 'Normal' },
        { parameter: 'LDL', value: '3.9 mmol/L', unit: 'mmol/L', reference: '< 3.4', status: 'High' },
        { parameter: 'Triglycerides', value: '1.8 mmol/L', unit: 'mmol/L', reference: '< 1.7', status: 'Normal' },
      ],
    },
    {
      id: 'LAB-2024-0889',
      test: 'Liver Function Test',
      date: '2024-01-28',
      orderedBy: 'Dr. Eze',
      department: 'Chemistry',
      status: 'Completed',
      critical: false,
      values: [
        { parameter: 'ALT', value: '35 U/L', unit: 'U/L', reference: '7-56', status: 'Normal' },
        { parameter: 'AST', value: '28 U/L', unit: 'U/L', reference: '10-40', status: 'Normal' },
        { parameter: 'Bilirubin', value: '12 µmol/L', unit: 'µmol/L', reference: '< 21', status: 'Normal' },
      ],
    },
  ];

  const columns = [
    { title: 'Lab ID', dataIndex: 'id', key: 'id' },
    { title: 'Test Name', dataIndex: 'test', key: 'test' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Ordered By', dataIndex: 'orderedBy', key: 'orderedBy' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag color="blue">{dept}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="success">{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedResult(record);
              setIsModalVisible(true);
            }}
          >
            View Details
          </Button>
          <Button size="small" icon={<DownloadOutlined />}>Download PDF</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-[1200px] mx-auto">
      <Title level={3}>Lab Results</Title>

      <Card>
        <div className="overflow-x-auto">
        <Table
          dataSource={results}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        </div>
      </Card>

      <Modal
        title={selectedResult?.test}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />}>Download PDF</Button>,
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>Close</Button>,
        ]}
        width={700}
      >
        {selectedResult && (
          <div>
            <Descriptions column={2} bordered size="small" className="">
              <Descriptions.Item label="Lab ID">{selectedResult.id}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedResult.date}</Descriptions.Item>
              <Descriptions.Item label="Ordered By">{selectedResult.orderedBy}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedResult.department}</Descriptions.Item>
            </Descriptions>

            <Title level={5}>Test Results</Title>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className=" text-left">Parameter</th>
                  <th className=" text-left">Value</th>
                  <th className=" text-left">Unit</th>
                  <th className=" text-left">Reference Range</th>
                  <th className=" text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedResult.values.map((value: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="">{value.parameter}</td>
                    <td className="">{value.value}</td>
                    <td className="">{value.unit}</td>
                    <td className="">{value.reference}</td>
                    <td className="">
                      <Tag color={value.status === 'Normal' ? 'success' : value.status === 'High' ? 'error' : 'warning'}>
                        {value.status}
                      </Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
