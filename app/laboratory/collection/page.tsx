'use client';

import React, { useState, useMemo } from 'react';
import { Alert, Modal, Form, Input, Select } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton } from '@/components/design-system';

interface Sample {
  id: string;
  patientName: string;
  mrn: string;
  testType: string;
  sampleId: string;
  collectedDate: string;
  collectedBy: string;
  status: 'Collected' | 'In Transit' | 'Received' | 'Processing' | 'Completed';
  priority: 'Routine' | 'Urgent' | 'Critical';
}

export default function SampleCollectionPage() {
  const { user, hasPermission } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [searchText, setSearchText] = useState('');
  const [isCollectModalVisible, setIsCollectModalVisible] = useState(false);
  const [form] = Form.useForm();

  // CRITICAL SECURITY: Restrict access to sample collection
  if (!hasPermission('laboratory:collection:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access sample collection. This area is restricted to laboratory staff and nurses."
          type="error"
          showIcon
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const [samples] = useState<Sample[]>([
    {
      id: '1',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      testType: 'Complete Blood Count',
      sampleId: 'SMP-2024-001',
      collectedDate: '2024-02-02 08:30',
      collectedBy: 'Nurse Amaka Okafor',
      status: 'Processing',
      priority: 'Routine',
    },
    {
      id: '2',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-2024-0002',
      testType: 'Lipid Profile',
      sampleId: 'SMP-2024-002',
      collectedDate: '2024-02-02 09:00',
      collectedBy: 'Nurse Grace Adebayo',
      status: 'Received',
      priority: 'Urgent',
    },
    {
      id: '3',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      testType: 'Malaria Parasite',
      sampleId: 'SMP-2024-003',
      collectedDate: '2024-02-02 09:15',
      collectedBy: 'Nurse Chinedu Eze',
      status: 'Collected',
      priority: 'Critical',
    },
    {
      id: '4',
      patientName: 'Chisom Eze',
      mrn: 'MRN-2024-0008',
      testType: 'Urine Routine',
      sampleId: 'SMP-2024-004',
      collectedDate: '2024-02-02 07:45',
      collectedBy: 'Nurse Funmilayo Adewale',
      status: 'Completed',
      priority: 'Routine',
    },
    {
      id: '5',
      patientName: 'Grace Adeleke',
      mrn: 'MRN-2024-0015',
      testType: 'Comprehensive Metabolic Panel',
      sampleId: 'SMP-2024-005',
      collectedDate: '2024-02-02 10:00',
      collectedBy: 'Nurse Amaka Okafor',
      status: 'In Transit',
      priority: 'Urgent',
    },
  ]);

  const filteredSamples = useMemo(() => {
    return samples.filter((s: any) => {
      const matchesSearch =
        s.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        s.sampleId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [samples, searchText, statusFilter]);

  const stats = {
    total: samples.length,
    collected: samples.filter((s: any) => s.status === 'Collected').length,
    inTransit: samples.filter((s: any) => s.status === 'In Transit').length,
    processing: samples.filter((s: any) => s.status === 'Processing').length,
    completed: samples.filter((s: any) => s.status === 'Completed').length,
    urgent: samples.filter((s: any) => s.priority === 'Urgent' || s.priority === 'Critical').length,
  };

  const columns = [
    {
      title: 'Sample ID',
      dataIndex: 'sampleId',
      key: 'sampleId',
      render: (id: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#E0E7FF',
            color: '#4338CA',
          }}
        >
          {id}
        </span>
      ),
    },
    { title: 'Patient', dataIndex: 'patientName', key: 'patientName' },
    {
      title: 'MRN',
      dataIndex: 'mrn',
      key: 'mrn',
      render: (mrn: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {mrn}
        </span>
      ),
    },
    { title: 'Test Type', dataIndex: 'testType', key: 'testType' },
    { title: 'Collected', dataIndex: 'collectedDate', key: 'collectedDate' },
    { title: 'Collected By', dataIndex: 'collectedBy', key: 'collectedBy' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'Critical' ? '#EF4444' : priority === 'Urgent' ? '#F59E0B' : '#64748B';
        const bg = priority === 'Critical' ? '#FEE2E2' : priority === 'Urgent' ? '#FEF3C7' : '#F1F5F9';
        return (
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              background: bg,
              color,
            }}
          >
            {priority.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase().replace(' ', '_')} type="lab" showIcon />,
    },
  ];

  return (
    <PageShell
      title="Sample Collection & Tracking"
      subtitle="Collect and track laboratory samples from collection to completion"
      action={
        hasPermission('laboratory:collection:create') && (
          <GradientButton icon={<PlusOutlined />} onClick={() => setIsCollectModalVisible(true)}>
            Collect Sample
          </GradientButton>
        )
      }
    >
      {/* Urgent Alert */}
      {stats.urgent > 0 && (
        <Alert
          title={`${stats.urgent} urgent/critical sample${stats.urgent > 1 ? 's' : ''} awaiting processing`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: '24px', borderRadius: '12px' }}
        />
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Samples"
          value={stats.total}
          color="#6366F1"
          bg="linear-gradient(135deg, #E0E7FF 0%, rgba(255,255,255,0.8) 100%)"
          border="#A5B4FC"
          index={0}
        />
        <StatCard
          label="Collected"
          value={stats.collected}
          color="#64748B"
          bg="linear-gradient(135deg, #F1F5F9 0%, rgba(255,255,255,0.8) 100%)"
          border="#CBD5E1"
          index={1}
        />
        <StatCard
          label="In Transit"
          value={stats.inTransit}
          color="#06B6D4"
          bg="linear-gradient(135deg, #CFFAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#67E8F9"
          index={2}
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={3}
        />
      </div>

      {/* Sample Collection Log */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Collection Log</h3>

        <SearchFilterBar
          searchPlaceholder="Search samples by patient or sample ID..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Collected', value: 'Collected' },
                { label: 'In Transit', value: 'In Transit' },
                { label: 'Received', value: 'Received' },
                { label: 'Processing', value: 'Processing' },
                { label: 'Completed', value: 'Completed' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredSamples.length}
          totalCount={samples.length}
          filterLabel="samples"
        />

        <ModernTable
          dataSource={filteredSamples}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 15 }}
        />
      </div>

      {/* Collect Sample Modal */}
      <Modal
        title="Collect New Sample"
        open={isCollectModalVisible}
        onCancel={() => setIsCollectModalVisible(false)}
        footer={[
          <GradientButton key="cancel" variant="secondary" onClick={() => setIsCollectModalVisible(false)}>
            Cancel
          </GradientButton>,
          <GradientButton key="submit" icon={<PlusOutlined />}>
            Record Collection
          </GradientButton>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Patient"
            name="patient"
            rules={[{ required: true, message: 'Please select or search for a patient' }]}
          >
            <Select
              placeholder="Search for patient"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: '1', label: 'Chukwuemeka Okonkwo - MRN-2024-0001' },
                { value: '2', label: 'Amaka Okafor - MRN-2024-0002' },
                { value: '3', label: 'Tobi Okafor - MRN-2024-0007' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Test Type"
            name="testType"
            rules={[{ required: true, message: 'Please select test type' }]}
          >
            <Select placeholder="Select test type">
              <Select.Option value="cbc">Complete Blood Count (CBC)</Select.Option>
              <Select.Option value="lipid">Lipid Profile</Select.Option>
              <Select.Option value="malaria">Malaria Parasite</Select.Option>
              <Select.Option value="urinalysis">Urinalysis</Select.Option>
              <Select.Option value="bmp">Basic Metabolic Panel</Select.Option>
              <Select.Option value="hba1c">HbA1c</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Sample Type"
            name="sampleType"
            rules={[{ required: true, message: 'Please select sample type' }]}
          >
            <Select placeholder="Select sample type">
              <Select.Option value="blood">Blood</Select.Option>
              <Select.Option value="urine">Urine</Select.Option>
              <Select.Option value="swab">Swab</Select.Option>
              <Select.Option value="tissue">Tissue</Select.Option>
              <Select.Option value="fluid">Body Fluid</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            initialValue="routine"
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Select>
              <Select.Option value="routine">Routine</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Collection Notes"
            name="notes"
          >
            <Input.TextArea
              rows={3}
              placeholder="Add any notes about the sample collection..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
