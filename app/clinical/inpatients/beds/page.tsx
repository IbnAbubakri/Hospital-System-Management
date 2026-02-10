'use client';

import React from 'react';
import { Card, Row, Col, Badge, Select, Space, Button } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { PageShell } from '@/components/design-system/PageShell';
import { StatCard } from '@/components/design-system/StatCard';
import { InfoCard } from '@/components/design-system/InfoCard';
import { StatusTag } from '@/components/design-system/StatusTag';

const { Option } = Select;

export default function BedsPage() {
  const beds = [
    { id: 'A-101', ward: 'Ward A', status: 'occupied', patient: 'John Smith', patientId: '1' },
    { id: 'A-102', ward: 'Ward A', status: 'occupied', patient: 'Sarah Johnson', patientId: '2' },
    { id: 'A-103', ward: 'Ward A', status: 'available', patient: null, patientId: null },
    { id: 'A-104', ward: 'Ward A', status: 'maintenance', patient: null, patientId: null },
    { id: 'A-105', ward: 'Ward A', status: 'available', patient: null, patientId: null },
    { id: 'B-201', ward: 'Ward B', status: 'occupied', patient: 'Robert Williams', patientId: '3' },
    { id: 'B-202', ward: 'Ward B', status: 'occupied', patient: 'Emily Davis', patientId: '4' },
    { id: 'B-203', ward: 'Ward B', status: 'available', patient: null, patientId: null },
    { id: 'ICU-01', ward: 'ICU', status: 'occupied', patient: 'Critical Patient A', patientId: '5' },
    { id: 'ICU-02', ward: 'ICU', status: 'occupied', patient: 'Critical Patient B', patientId: '6' },
    { id: 'ICU-03', ward: 'ICU', status: 'available', patient: null, patientId: null },
    { id: 'ICU-04', ward: 'ICU', status: 'maintenance', patient: null, patientId: null },
  ];

  const wards = ['All', 'Ward A', 'Ward B', 'ICU'];
  const [selectedWard, setSelectedWard] = React.useState('All');

  const filteredBeds = selectedWard === 'All' ? beds : beds.filter((bed: any) => bed.ward === selectedWard);

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'available': return 'border-l-4 border-l-green-500';
      case 'occupied': return 'border-l-4 border-l-red-500';
      case 'maintenance': return 'border-l-4 border-l-gray-400';
      case 'reserved': return 'border-l-4 border-l-yellow-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <PageShell
      title="Bed Management"
      subtitle="View and manage hospital bed occupancy"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Beds"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Available"
          value={stats.available}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Occupied"
          value={stats.occupied}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Maintenance"
          value={stats.maintenance}
          color="#6B7280"
          bg="linear-gradient(135deg, #F3F4F6 0%, rgba(255,255,255,0.8) 100%)"
          border="#D1D5DB"
          index={3}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Space>
          <span className="text-gray-600 mr-2">Filter by ward:</span>
          <Select
            value={selectedWard}
            onChange={setSelectedWard}
            style={{ width: 150 }}
          >
            {wards.map((ward) => (
              <Option key={ward} value={ward}>{ward}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <InfoCard
        title="Bed Status"
      >
        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-sm">Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">Reserved</span>
          </div>
        </div>

        {/* Beds Grid */}
        <Row gutter={16}>
          {filteredBeds.map((bed) => (
            <Col xs={24} sm={12} md={8} lg={6} key={bed.id} className="mb-4">
              <Card
                size="small"
                className={`${getStatusBg(bed.status)}`}
                style={{ borderRadius: '8px' }}
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{bed.id}</span>
                    <StatusTag status={bed.status} type="admission" />
                  </div>
                }
              >
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Ward: </span>
                    <span className="font-medium">{bed.ward}</span>
                  </div>
                  {bed.patient ? (
                    <div>
                      <div className="flex items-center gap-2 mt-2">
                        <UserOutlined className="text-gray-500" />
                        <span className="font-medium">{bed.patient}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <UserOutlined className="text-3xl text-gray-300" />
                      <p className="text-gray-500 text-sm mt-1">Unoccupied</p>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </InfoCard>
    </PageShell>
  );
}
