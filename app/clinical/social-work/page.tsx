'use client';

import React, { useState, useMemo } from 'react';
import { Modal, Drawer, Form, Select, Input, Space, Row, Col } from 'antd';
import { PlusOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { TextArea } = Input;

interface SocialWorkCase {
  id: string;
  patientName: string;
  mrn: string;
  caseType: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  socialWorker: string;
  openedDate: string;
  lastContact: string;
  notes: string;
}

const mockCases: SocialWorkCase[] = [
  {
    id: 'SW-2024-0892',
    patientName: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    caseType: 'Financial Counseling',
    priority: 'high',
    status: 'open',
    socialWorker: 'SW Grace Adeleke',
    openedDate: '2024-02-01',
    lastContact: '2024-02-05',
    notes: 'Patient requires assistance with hospital bills and insurance coverage',
  },
  {
    id: 'SW-2024-0891',
    patientName: 'Amaka Okafor',
    mrn: 'MRN-2024-0002',
    caseType: 'Discharge Planning',
    priority: 'medium',
    status: 'in_progress',
    socialWorker: 'SW Chioma Eze',
    openedDate: '2024-01-28',
    lastContact: '2024-02-04',
    notes: 'Coordinating home health services and equipment for discharge',
  },
  {
    id: 'SW-2024-0890',
    patientName: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    caseType: 'Family Support',
    priority: 'high',
    status: 'open',
    socialWorker: 'SW Fatima Ibrahim',
    openedDate: '2024-02-03',
    lastContact: '2024-02-05',
    notes: 'Pediatric patient requires family counseling and support services',
  },
  {
    id: 'SW-2024-0889',
    patientName: 'Ngozi Eze',
    mrn: 'MRN-2024-0005',
    caseType: 'Psychosocial Assessment',
    priority: 'medium',
    status: 'resolved',
    socialWorker: 'SW Grace Adeleke',
    openedDate: '2024-01-25',
    lastContact: '2024-02-02',
    notes: 'Completed psychosocial assessment and provided resources',
  },
  {
    id: 'SW-2024-0888',
    patientName: 'Adaobi Nwosu',
    mrn: 'MRN-2024-0003',
    caseType: 'Community Resources',
    priority: 'low',
    status: 'closed',
    socialWorker: 'SW Chioma Eze',
    openedDate: '2024-01-20',
    lastContact: '2024-01-28',
    notes: 'Connected patient with community support programs',
  },
  {
    id: 'SW-2024-0887',
    patientName: 'Emeka Okafor',
    mrn: 'MRN-2024-0004',
    caseType: 'End of Life Care',
    priority: 'high',
    status: 'in_progress',
    socialWorker: 'SW Fatima Ibrahim',
    openedDate: '2024-02-02',
    lastContact: '2024-02-05',
    notes: 'Providing counseling and support for patient and family',
  },
];

export default function SocialWorkPage() {
  const { hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedCase, setSelectedCase] = useState<SocialWorkCase | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredCases = useMemo(() => {
    return mockCases.filter((c: any) => {
      const matchesSearch =
        c.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.mrn.toLowerCase().includes(searchText.toLowerCase()) ||
        c.socialWorker.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  // CRITICAL SECURITY: Restrict access to clinical staff
  if (!hasPermission('clinical:socialwork:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3 p-4" style={{ background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <HeartOutlined style={{ color: '#DC2626', fontSize: '20px' }} />
            <div>
              <h3 className="font-semibold text-red-900">Access Denied</h3>
              <p className="text-sm text-red-700">You don&apos;tt have permission to access social work services. This area is restricted to clinical staff.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Case ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#DBEAFE', color: '#1E40AF' }}>
          {id}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: SocialWorkCase) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Case Type',
      dataIndex: 'caseType',
      key: 'caseType',
      render: (type: string) => (
        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: '#F3E8FF', color: '#7C3AED' }}>
          {type}
        </span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors: Record<string, { bg: string; color: string }> = {
          high: { bg: '#FEE2E2', color: '#DC2626' },
          medium: { bg: '#FEF3C7', color: '#D97706' },
          low: { bg: '#DBEAFE', color: '#1E40AF' },
        };
        const style = colors[priority] || colors.low;
        return (
          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, background: style.bg, color: style.color }}>
            {priority.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />,
    },
    { title: 'Social Worker', dataIndex: 'socialWorker', key: 'socialWorker' },
    { title: 'Opened', dataIndex: 'openedDate', key: 'openedDate' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SocialWorkCase) => (
        <Space>
          <GradientButton size="small" onClick={() => { setSelectedCase(record); setDrawerVisible(true); }}>
            View Details
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    total: mockCases.length,
    open: mockCases.filter((c: any) => c.status === 'open').length,
    inProgress: mockCases.filter((c: any) => c.status === 'in_progress').length,
    resolved: mockCases.filter((c: any) => c.status === 'resolved').length,
  };

  return (
    <PageShell
      title="Social Work Services"
      subtitle="Manage social work cases and patient support services"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          New Case
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Cases"
          value={stats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Open"
          value={stats.open}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={1}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={2}
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* Social Work Cases Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search cases by patient, MRN, or social worker..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Resolved', value: 'resolved' },
                { label: 'Closed', value: 'closed' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredCases.length}
          totalCount={mockCases.length}
          filterLabel="cases"
        />

        <ModernTable dataSource={filteredCases} columns={columns} rowKey="id" pagination={{ defaultPageSize: 10 }} />
      </div>

      {/* Case Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <HeartOutlined style={{ color: '#3B82F6' }} />
            <span>Case Details</span>
          </div>
        }
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedCase(null);
        }}
      >
        {selectedCase && (
          <div>
            <InfoCard title="Patient Information">
              <Row gutter={16}>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">Patient Name</div>
                  <div className="font-medium">{selectedCase.patientName}</div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">MRN</div>
                  <div>{selectedCase.mrn}</div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">Case Type</div>
                  <div>{selectedCase.caseType}</div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">Priority</div>
                  <div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        background:
                          selectedCase.priority === 'high'
                            ? '#FEE2E2'
                            : selectedCase.priority === 'medium'
                            ? '#FEF3C7'
                            : '#DBEAFE',
                        color:
                          selectedCase.priority === 'high'
                            ? '#DC2626'
                            : selectedCase.priority === 'medium'
                            ? '#D97706'
                            : '#1E40AF',
                      }}
                    >
                      {selectedCase.priority.toUpperCase()}
                    </span>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">Opened Date</div>
                  <div>{selectedCase.openedDate}</div>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">Last Contact</div>
                  <div>{selectedCase.lastContact}</div>
                </Col>
              </Row>
            </InfoCard>

            <InfoCard title="Status & Assignment">
              <div className="mb-3">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <StatusTag status={selectedCase.status} type="patient" showIcon />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Assigned Social Worker</div>
                <div>{selectedCase.socialWorker}</div>
              </div>
            </InfoCard>

            <InfoCard title="Case Notes">
              <div className="text-sm text-gray-700">{selectedCase.notes}</div>
            </InfoCard>
          </div>
        )}
      </Drawer>

      {/* New Case Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined style={{ color: '#3B82F6' }} />
            <span>Create New Case</span>
          </div>
        }
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Create Case"
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
