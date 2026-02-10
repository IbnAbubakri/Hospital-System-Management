'use client';

import React, { useState, useMemo } from 'react';
import { Modal, Form, Input, Select, Space } from 'antd';
import { FileTextOutlined, PlusOutlined, BookOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ClinicalProtocol {
  id: string;
  name: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  description: string;
}

const mockProtocols: ClinicalProtocol[] = [
  {
    id: 'PROT-001',
    name: 'Acute Myocardial Infarction Management',
    category: 'Cardiology',
    version: 'v2.1',
    lastUpdated: '2024-01-15',
    status: 'active',
    description: 'Standardized protocol for managing acute MI cases including thrombolytic therapy criteria',
  },
  {
    id: 'PROT-002',
    name: 'Hypertension Treatment Guidelines',
    category: 'Cardiology',
    version: 'v3.0',
    lastUpdated: '2024-01-10',
    status: 'active',
    description: 'Evidence-based guidelines for hypertension management and medication protocols',
  },
  {
    id: 'PROT-003',
    name: 'Heart Failure Protocol',
    category: 'Cardiology',
    version: 'v1.8',
    lastUpdated: '2024-01-12',
    status: 'active',
    description: 'Comprehensive heart failure management including ACE inhibitors and beta-blockers',
  },
  {
    id: 'PROT-004',
    name: 'Cardiopulmonary Resuscitation (CPR)',
    category: 'Emergency',
    version: 'v4.0',
    lastUpdated: '2024-01-20',
    status: 'active',
    description: 'Updated ACLS protocols for CPR and emergency cardiovascular care',
  },
  {
    id: 'PROT-005',
    name: 'Anaphylaxis Management',
    category: 'Emergency',
    version: 'v2.2',
    lastUpdated: '2024-01-18',
    status: 'active',
    description: 'Emergency response protocol for anaphylactic reactions and epinephrine administration',
  },
  {
    id: 'PROT-006',
    name: 'Stroke Assessment (FAST)',
    category: 'Emergency',
    version: 'v2.0',
    lastUpdated: '2024-01-08',
    status: 'active',
    description: 'Rapid stroke assessment and thrombolysis protocols for acute ischemic stroke',
  },
  {
    id: 'PROT-007',
    name: 'Pediatric Fever Management',
    category: 'Pediatrics',
    version: 'v1.5',
    lastUpdated: '2024-01-05',
    status: 'active',
    description: 'Evidence-based approach to pediatric fever assessment and management',
  },
  {
    id: 'PROT-008',
    name: 'Childhood Asthma Exacerbation',
    category: 'Pediatrics',
    version: 'v2.1',
    lastUpdated: '2024-01-14',
    status: 'active',
    description: 'Standardized protocol for managing acute asthma exacerbations in children',
  },
  {
    id: 'PROT-009',
    name: 'Sepsis Management Bundle',
    category: 'Internal Medicine',
    version: 'v3.2',
    lastUpdated: '2024-01-22',
    status: 'active',
    description: '3-hour and 6-hour sepsis bundles for early goal-directed therapy',
  },
  {
    id: 'PROT-010',
    name: 'Diabetes Management Protocol',
    category: 'Endocrinology',
    version: 'v2.4',
    lastUpdated: '2024-01-16',
    status: 'active',
    description: 'Inpatient glycemic management and insulin protocol',
  },
  {
    id: 'PROT-011',
    name: 'VTE Prophylaxis',
    category: 'Internal Medicine',
    version: 'v1.9',
    lastUpdated: '2024-01-11',
    status: 'draft',
    description: 'Venous thromboembolism prevention protocol for hospitalized patients',
  },
  {
    id: 'PROT-012',
    name: 'Pain Management Guidelines',
    category: 'Anesthesiology',
    version: 'v2.0',
    lastUpdated: '2023-12-20',
    status: 'active',
    description: 'Opioid-sparing multimodal pain management approach',
  },
];

export default function ClinicalProtocolsPage() {
  const { hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredProtocols = useMemo(() => {
    return mockProtocols.filter((protocol) => {
      const matchesSearch =
        protocol.name.toLowerCase().includes(searchText.toLowerCase()) ||
        protocol.id.toLowerCase().includes(searchText.toLowerCase()) ||
        protocol.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !categoryFilter || protocol.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, categoryFilter]);

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:protocols:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <BookOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access clinical protocols. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(mockProtocols.map((p: any) => p.category)));

  const columns = [
    {
      title: 'Protocol ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#DBEAFE', color: '#1E40AF' }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Protocol Name',
      key: 'name',
      render: (_: any, record: ClinicalProtocol) => (
        <div>
          <div className="font-medium text-gray-900">{record.name}</div>
          <div className="text-xs text-gray-500 mt-1">{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#F3E8FF', color: '#7C3AED' }}>
          {category}
        </span>
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => <span className="text-sm font-mono">{version}</span>,
    },
    { title: 'Last Updated', dataIndex: 'lastUpdated', key: 'lastUpdated' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <GradientButton variant="secondary" size="small">
            View Protocol
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockProtocols.length,
    active: mockProtocols.filter((p: any) => p.status === 'active').length,
    cardiology: mockProtocols.filter((p: any) => p.category === 'Cardiology').length,
    emergency: mockProtocols.filter((p: any) => p.category === 'Emergency').length,
  };

  return (
    <PageShell
      title="Clinical Protocols & Guidelines"
      subtitle="Evidence-based standardized treatment protocols for consistent patient care"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add Protocol
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Protocols"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Active"
          value={stats.active}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Cardiology"
          value={stats.cardiology}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Emergency"
          value={stats.emergency}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
        />
      </div>

      {/* Protocols Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search protocols by name, ID, or description..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'category',
              label: 'Category',
              value: categoryFilter,
              options: [
                { label: 'All Categories', value: '' },
                ...categories.map((cat) => ({ label: cat, value: cat })),
              ],
              onChange: (value) => setCategoryFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredProtocols.length}
          totalCount={mockProtocols.length}
          filterLabel="protocols"
        />

        <ModernTable dataSource={filteredProtocols} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} />
      </div>

      {/* Add Protocol Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined style={{ color: '#3B82F6' }} />
            <span>Add Clinical Protocol</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        okText="Save Protocol"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
          <Form.Item name="note" label="Notes">
            <Input.TextArea rows={3} placeholder="Enter details..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
