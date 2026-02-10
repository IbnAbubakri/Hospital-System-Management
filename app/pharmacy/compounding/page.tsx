'use client';

import React, { useState } from 'react';
import { Card, Typography, Table, Button, Space, Row, Col, Select, Tag, Statistic, Drawer, Input, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CompoundingOrder {
  id: string;
  patientName: string;
  mrn: string;
  medication: string;
  strength: string;
  dosage: string;
  quantity: number;
  dueDate: string;
  pharmacist: string;
  status: 'Pending' | 'Compounding' | 'Ready' | 'Dispensed';
}

export default function CompoundingPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CompoundingOrder | null>(null);

  const [orders] = useState<CompoundingOrder[]>([
    {
      id: '1',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-001',
      medication: 'Custom Calcium Suspension',
      strength: '250mg/5mL',
      dosage: '5mL twice daily',
      quantity: 150,
      dueDate: '2024-02-05',
      pharmacist: 'Dr. Adaobi',
      status: 'Compounding',
    },
    {
      id: '2',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-005',
      medication: 'Pediatric Liquid Ibuprofen',
      strength: '100mg/5mL',
      dosage: '10mL every 6 hours',
      quantity: 200,
      dueDate: '2024-02-05',
      pharmacist: 'Dr. Emeka',
      status: 'Ready',
    },
    {
      id: '3',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-007',
      medication: 'Customized Vitamin D Drops',
      strength: '4000 IU/mL',
      dosage: '0.5mL daily',
      quantity: 15,
      dueDate: '2024-02-06',
      pharmacist: 'Dr. Adaobi',
      status: 'Pending',
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pending': 'orange',
      'Compounding': 'blue',
      'Ready': 'green',
      'Dispensed': 'purple',
    };
    return colors[status] || 'default';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchText ||
      order.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.medication.toLowerCase().includes(searchText.toLowerCase()) ||
      order.mrn.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: 'MRN', dataIndex: 'mrn', key: 'mrn' },
    { title: 'Patient Name', dataIndex: 'patientName', key: 'patientName' },
    { title: 'Medication', dataIndex: 'medication', key: 'medication' },
    { title: 'Strength', dataIndex: 'strength', key: 'strength' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (q: number) => `${q}g` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CompoundingOrder) => (
        <Button type="link" onClick={() => { setSelectedOrder(record); setDrawerVisible(true); }}>
          View Details
        </Button>
      ),
    },
  ];

  const stats = {
    pending: orders.filter((o: any) => o.status === 'Pending').length,
    compounding: orders.filter((o: any) => o.status === 'Compounding').length,
    ready: orders.filter((o: any) => o.status === 'Ready').length,
    dispensed: orders.filter((o: any) => o.status === 'Dispensed').length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Compounding Services</Title>
      <Text type="secondary">Custom medication compounding and preparation</Text>

      <Row gutter={[24, 24]} style={{ marginTop: '24px', marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Pending" value={stats.pending} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Compounding" value={stats.compounding} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Ready" value={stats.ready} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Dispensed" value={stats.dispensed} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by patient, medication, or MRN"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 150 }}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Compounding">Compounding</Select.Option>
            <Select.Option value="Ready">Ready</Select.Option>
            <Select.Option value="Dispensed">Dispensed</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />}>New Order</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </Card>

      <Drawer
        title="Compounding Order Details"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="MRN">{selectedOrder.mrn}</Descriptions.Item>
            <Descriptions.Item label="Patient Name">{selectedOrder.patientName}</Descriptions.Item>
            <Descriptions.Item label="Medication">{selectedOrder.medication}</Descriptions.Item>
            <Descriptions.Item label="Strength">{selectedOrder.strength}</Descriptions.Item>
            <Descriptions.Item label="Dosage">{selectedOrder.dosage}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{selectedOrder.quantity}g</Descriptions.Item>
            <Descriptions.Item label="Due Date">{selectedOrder.dueDate}</Descriptions.Item>
            <Descriptions.Item label="Pharmacist">{selectedOrder.pharmacist}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
