'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Input, Select, DatePicker } from 'antd';
import { CheckCircleOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function GRNPage() {
  const [searchText, setSearchText] = React.useState('');

  const grns = [
    { id: 'GRN-2024-0156', vendor: 'MedSupply Nigeria Ltd', invoice: 'INV-2024-0891', items: 15, receivedDate: '2024-02-05', receivedBy: 'Chukwu Emeka', status: 'Verified', totalValue: 450000 },
    { id: 'GRN-2024-0155', vendor: 'Surgical Equip Co.', invoice: 'INV-2024-0890', items: 8, receivedDate: '2024-02-05', receivedBy: 'Amina Yusuf', status: 'Pending', totalValue: 820000 },
    { id: 'GRN-2024-0154', vendor: 'LabTech Solutions', invoice: 'INV-2024-0889', items: 25, receivedDate: '2024-02-04', receivedBy: 'Grace Okafor', status: 'Verified', totalValue: 210000 },
    { id: 'GRN-2024-0153', vendor: 'Pharma Distributors', invoice: 'INV-2024-0888', items: 12, receivedDate: '2024-02-04', receivedBy: 'Ifeanyi Okonkwo', status: 'Verified', totalValue: 180000 },
    { id: 'GRN-2024-0152', vendor: 'Medical Supplies Ltd', invoice: 'INV-2024-0887', items: 20, receivedDate: '2024-02-03', receivedBy: 'Chinyere Okafor', status: 'Rejected', totalValue: 320000 },
  ];

  const columns = [
    { title: 'GRN No.', dataIndex: 'id', key: 'id' },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    { title: 'Invoice No.', dataIndex: 'invoice', key: 'invoice' },
    { title: 'Items Received', dataIndex: 'items', key: 'items' },
    { title: 'Received Date', dataIndex: 'receivedDate', key: 'receivedDate' },
    { title: 'Received By', dataIndex: 'receivedBy', key: 'receivedBy' },
    {
      title: 'Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (val: number) => <span>₦{val.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Verified' ? 'success' : status === 'Pending' ? 'warning' : 'error';
        const icon = status === 'Verified' ? <CheckCircleOutlined /> : null;
        return <Tag color={color} icon={icon}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small" icon={<PrinterOutlined />}>Print</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-7xl mx-auto">
      <div className=" -col sm:-row items-start sm:   ">
        <Title level={3}>Goods Received Notes</Title>
        <div className=" -col sm:-row items-stretch sm:  w-full sm:w-auto">
          <Input.Search
            placeholder="Search GRN..."
            allowClear
            className="w-full sm:w-[250px]"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" className="w-full sm:w-auto">Create GRN</Button>
        </div>
      </div>

      <Card title="Recent GRNs" className=" sm:">
        <div className="overflow-x-auto">
          <Table
            dataSource={grns.filter(g =>
              g.id.toLowerCase().includes(searchText.toLowerCase()) ||
              g.vendor.toLowerCase().includes(searchText.toLowerCase())
            )}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>
    </div>
  );
}
