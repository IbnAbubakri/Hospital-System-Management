'use client';

import React from 'react';
import { Table, Button, Tag, Progress, App } from 'antd';
import { ToolOutlined, PlusOutlined } from '@ant-design/icons';
import { formatDate } from '@/lib/utils';

interface Equipment {
  id: string;
  equipmentId: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  installationDate: Date;
  lastMaintenance: Date;
  nextMaintenance: Date;
  status: 'operational' | 'maintenance' | 'out_of_service';
}

const mockEquipment: Equipment[] = [
  { id: '1', equipmentId: 'EQ-001', name: 'Hematology Analyzer', category: 'Hematology', model: 'Sysmex XN-1000', serialNumber: 'SN-2023-001', installationDate: new Date('2023-01-15'), lastMaintenance: new Date('2024-01-15'), nextMaintenance: new Date('2024-04-15'), status: 'operational' },
  { id: '2', equipmentId: 'EQ-002', name: 'Biochemistry Analyzer', category: 'Biochemistry', model: 'Cobas c311', serialNumber: 'SN-2023-002', installationDate: new Date('2023-02-01'), lastMaintenance: new Date('2024-01-20'), nextMaintenance: new Date('2024-04-20'), status: 'operational' },
  { id: '3', equipmentId: 'EQ-003', name: 'Coagulation Analyzer', category: 'Coagulation', model: 'ACL TOP', serialNumber: 'SN-2023-003', installationDate: new Date('2023-03-10'), lastMaintenance: new Date('2024-02-01'), nextMaintenance: new Date('2024-05-01'), status: 'maintenance' },
  { id: '4', equipmentId: 'EQ-004', name: 'Microscope', category: 'General', model: 'Olympus CX23', serialNumber: 'SN-2022-004', installationDate: new Date('2022-06-15'), lastMaintenance: new Date('2024-01-10'), nextMaintenance: new Date('2024-04-10'), status: 'operational' },
];

export default function EquipmentPage() {
  const { message } = App.useApp();
  // Handle add equipment
  const handleAddEquipment = () => {
    message.success('Add equipment feature coming soon');
  };

  const columns = [
    { title: 'Equipment ID', dataIndex: 'equipmentId', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serial' },
    { title: 'Last Maintenance', dataIndex: 'lastMaintenance', key: 'last', render: (d: Date) => formatDate(d) },
    { title: 'Next Maintenance', dataIndex: 'nextMaintenance', key: 'next', render: (d: Date) => formatDate(d) },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          operational: { color: 'success', text: 'Operational' },
          maintenance: { color: 'warning', text: 'Maintenance' },
          out_of_service: { color: 'error', text: 'Out of Service' },
        };
        const { color, text } = config[status];
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
      <div className=" sm: bg-white -xl border border-gray-200">
        <div className=" -col sm:-row items-start sm:   ">
          <div>
            <h1 className="text-2xl font-semibold  ">Lab Equipment</h1>
            <p className=" ">Laboratory equipment management and maintenance</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEquipment} className="w-full sm:w-auto">Add Equipment</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3  ">
          <div className=" bg-gray-50 -lg">
            <div className="  ">Total Equipment</div>
            <div className="text-2xl font-bold ">{mockEquipment.length}</div>
          </div>
          <div className=" bg-green-50 -lg">
            <div className="  ">Operational</div>
            <div className="text-2xl font-bold ">{mockEquipment.filter((e: any) => e.status === 'operational').length}</div>
          </div>
          <div className=" bg-yellow-50 -lg">
            <div className="  ">Under Maintenance</div>
            <div className="text-2xl font-bold text-yellow-600">{mockEquipment.filter((e: any) => e.status === 'maintenance').length}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table dataSource={mockEquipment} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} size="middle" />
        </div>
      </div>
    </div>
  );
}
