'use client';

import React from 'react';
import { Card, Typography, Table, Button, Tag, Space, Progress, Row, Col } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function ParkingPage() {
  const parkingSpots = [
    { id: 'P-001', level: 'Ground Floor', spot: 'A-1', type: 'General', status: 'Occupied', vehicle: 'ABC-123-GH', owner: 'Visitor - Ngozi Eze', since: '2024-02-05 09:30' },
    { id: 'P-002', level: 'Ground Floor', spot: 'A-2', type: 'General', status: 'Vacant', vehicle: null, owner: null, since: null },
    { id: 'P-003', level: 'Ground Floor', spot: 'B-1', type: 'Reserved Staff', status: 'Occupied', vehicle: 'XYZ-456-GH', owner: 'Dr. Okonkwo', since: '2024-02-05 08:00' },
    { id: 'P-004', level: 'Ground Floor', spot: 'B-2', type: 'Reserved Staff', status: 'Vacant', vehicle: null, owner: null, since: null },
    { id: 'P-005', level: 'First Floor', spot: 'C-1', type: 'Emergency', status: 'Vacant', vehicle: null, owner: null, since: null },
    { id: 'P-006', level: 'First Floor', spot: 'C-2', type: 'Emergency', status: 'Occupied', vehicle: 'AMB-001', owner: 'Ambulance', since: '2024-02-05 11:00' },
    { id: 'P-007', level: 'Ground Floor', spot: 'A-3', type: 'General', status: 'Vacant', vehicle: null, owner: null, since: null },
    { id: 'P-008', level: 'Ground Floor', spot: 'A-4', type: 'General', status: 'Occupied', vehicle: 'DEF-789-GH', owner: 'Visitor', since: '2024-02-05 10:15' },
  ];

  const columns = [
    { title: 'Spot ID', dataIndex: 'id', key: 'id' },
    { title: 'Level', dataIndex: 'level', key: 'level' },
    { title: 'Spot Number', dataIndex: 'spot', key: 'spot' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === 'Emergency' ? 'error' : type === 'Reserved Staff' ? 'blue' : 'default'}>{type}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'Occupied' ? 'warning' : 'success'}>{status}</Tag>,
    },
    { title: 'Vehicle', dataIndex: 'vehicle', key: 'vehicle', render: (vehicle: string | null) => vehicle || '-' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', render: (owner: string | null) => owner || '-' },
    { title: 'Since', dataIndex: 'since', key: 'since', render: (time: string | null) => time || '-' },
  ];

  const totalSpots = parkingSpots.length;
  const occupiedSpots = parkingSpots.filter(p => p.status === 'Occupied').length;
  const availableSpots = totalSpots - occupiedSpots;
  const occupancyRate = Math.round((occupiedSpots / totalSpots) * 100);

  const generalSpots = parkingSpots.filter(p => p.type === 'General').length;
  const reservedSpots = parkingSpots.filter(p => p.type === 'Reserved Staff').length;
  const emergencySpots = parkingSpots.filter(p => p.type === 'Emergency').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Parking Management</Title>
        <Button type="primary" icon={<CarOutlined />}>Reserve Spot</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{availableSpots}</div>
            <div className="text-gray-500">Available Spots</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{occupiedSpots}</div>
            <div className="text-gray-500">Occupied</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalSpots}</div>
            <div className="text-gray-500">Total Spots</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{occupancyRate}%</div>
            <div className="text-gray-500">Occupancy Rate</div>
          </div>
        </Card>
      </div>

      <Card title="Parking Distribution" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title="General Parking ({generalSpots} spots)">
              <div className="flex items-center justify-between mb-2">
                <span>Occupancy</span>
                <span className="font-semibold">{parkingSpots.filter(p => p.type === 'General' && p.status === 'Occupied').length}/{generalSpots}</span>
              </div>
              <Progress percent={Math.round((parkingSpots.filter(p => p.type === 'General' && p.status === 'Occupied').length / generalSpots) * 100)} strokeColor="#3B82F6" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Reserved Staff ({reservedSpots} spots)">
              <div className="flex items-center justify-between mb-2">
                <span>Occupancy</span>
                <span className="font-semibold">{parkingSpots.filter(p => p.type === 'Reserved Staff' && p.status === 'Occupied').length}/{reservedSpots}</span>
              </div>
              <Progress percent={Math.round((parkingSpots.filter(p => p.type === 'Reserved Staff' && p.status === 'Occupied').length / reservedSpots) * 100)} strokeColor="#10B981" />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Emergency ({emergencySpots} spots)">
              <div className="flex items-center justify-between mb-2">
                <span>Occupancy</span>
                <span className="font-semibold">{parkingSpots.filter(p => p.type === 'Emergency' && p.status === 'Occupied').length}/{emergencySpots}</span>
              </div>
              <Progress percent={Math.round((parkingSpots.filter(p => p.type === 'Emergency' && p.status === 'Occupied').length / emergencySpots) * 100)} strokeColor="#EF4444" />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card title="Parking Spots">
        <Table dataSource={parkingSpots} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}
