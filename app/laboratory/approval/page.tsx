'use client';

import React, { useState, useMemo } from 'react';
import { Modal, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';

interface LabApprovalRequest {
  id: string;
  patient: string;
  mrn: string;
  testType: string;
  requestedBy: string;
  department: string;
  priority: 'Routine' | 'Urgent' | 'Emergency';
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  clinicalInfo: string;
  rejectionReason?: string;
}

export default function LabApprovalPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedRequest, setSelectedRequest] = useState<LabApprovalRequest | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // CRITICAL SECURITY: Restrict access to lab approval
  if (!hasPermission('laboratory:approval:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginTop: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#EF4444', marginBottom: '8px' }}>Access Denied</h2>
          <p style={{ color: '#64748B' }}>
            You don&apos;tt have permission to access lab test approval. This area is restricted to laboratory supervisors and authorized staff.
          </p>
        </div>
      </div>
    );
  }

  const [requests] = useState<LabApprovalRequest[]>([
    {
      id: 'LAB-APR-001',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      testType: 'Complete Blood Count',
      requestedBy: 'Dr. Okonkwo',
      department: 'Cardiology',
      priority: 'Routine',
      requestDate: '2024-02-05 09:30',
      status: 'Pending',
      urgency: 'Routine',
      clinicalInfo: 'Routine check for hypertensive patient'
    },
    {
      id: 'LAB-APR-002',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      testType: 'Troponin I',
      requestedBy: 'Dr. Eze',
      department: 'Emergency',
      priority: 'Urgent',
      requestDate: '2024-02-05 10:15',
      status: 'Pending',
      urgency: 'Urgent',
      clinicalInfo: 'Patient presenting with chest pain'
    },
    {
      id: 'LAB-APR-003',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      testType: 'Malaria Parasite',
      requestedBy: 'Dr. Nnamdi',
      department: 'Pediatrics',
      priority: 'Routine',
      requestDate: '2024-02-05 11:00',
      status: 'Approved',
      urgency: 'Routine',
      clinicalInfo: 'Fever for 3 days, suspect malaria'
    },
    {
      id: 'LAB-APR-004',
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      testType: 'Lipid Profile',
      requestedBy: 'Dr. Okafor',
      department: 'General Medicine',
      priority: 'Routine',
      requestDate: '2024-02-05 11:30',
      status: 'Pending',
      urgency: 'Routine',
      clinicalInfo: 'Annual health screening'
    },
    {
      id: 'LAB-APR-005',
      patient: 'Emeka Okafor',
      mrn: 'MRN-2024-0002',
      testType: 'HbA1c',
      requestedBy: 'Dr. Eze',
      department: 'Endocrinology',
      priority: 'Routine',
      requestDate: '2024-02-05 12:00',
      status: 'Rejected',
      urgency: 'Routine',
      clinicalInfo: 'Diabetes monitoring',
      rejectionReason: 'Duplicate request from yesterday'
    },
  ]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.patient.toLowerCase().includes(searchText.toLowerCase()) ||
        request.id.toLowerCase().includes(searchText.toLowerCase()) ||
        request.testType.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus = !statusFilter || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchText, statusFilter]);

  const stats = {
    pending: requests.filter((r: any) => r.status === 'Pending').length,
    approved: requests.filter((r: any) => r.status === 'Approved').length,
    rejected: requests.filter((r: any) => r.status === 'Rejected').length,
    urgent: requests.filter((r: any) => r.priority === 'Urgent' || r.priority === 'Emergency').length,
  };

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
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
    { title: 'Patient', dataIndex: 'patient', key: 'patient' },
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
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color = priority === 'Urgent' || priority === 'Emergency' ? '#EF4444' : '#64748B';
        const bg = priority === 'Urgent' || priority === 'Emergency' ? '#FEE2E2' : '#F1F5F9';
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
    { title: 'Request Date', dataIndex: 'requestDate', key: 'requestDate' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status.toLowerCase()} type="lab" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LabApprovalRequest) => (
        <div className="flex gap-2">
          <GradientButton
            variant="secondary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRequest(record);
              setIsViewModalVisible(true);
            }}
          >
            View
          </GradientButton>
          {record.status === 'Pending' && hasPermission('laboratory:approval:approve') && (
            <>
              <GradientButton
                variant="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ background: '#10B981' }}
              >
                Approve
              </GradientButton>
              <GradientButton
                variant="secondary"
                size="small"
                icon={<CloseOutlined />}
                style={{ borderColor: '#EF4444', color: '#EF4444' }}
              >
                Reject
              </GradientButton>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Lab Test Approval Queue"
      subtitle="Review and approve laboratory test requests"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Pending Approval"
          value={stats.pending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={0}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Urgent Requests"
          value={stats.urgent}
          color="#DC2626"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={3}
        />
      </div>

      {/* Approval Queue */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Queue</h3>

        <SearchFilterBar
          searchPlaceholder="Search requests by patient, ID, or test type..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Approved', value: 'Approved' },
                { label: 'Rejected', value: 'Rejected' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredRequests.length}
          totalCount={requests.length}
          filterLabel="requests"
        />

        <ModernTable
          dataSource={filteredRequests}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* View Modal */}
      <Modal
        title="Lab Request Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          selectedRequest?.status === 'Pending' && hasPermission('laboratory:approval:approve') && (
            <GradientButton
              key="reject"
              variant="secondary"
              icon={<CloseOutlined />}
              style={{ borderColor: '#EF4444', color: '#EF4444' }}
            >
              Reject
            </GradientButton>
          ),
          selectedRequest?.status === 'Pending' && hasPermission('laboratory:approval:approve') && (
            <GradientButton
              key="approve"
              icon={<CheckOutlined />}
            >
              Approve
            </GradientButton>
          ),
          <GradientButton
            key="close"
            variant="secondary"
            onClick={() => setIsViewModalVisible(false)}
          >
            Close
          </GradientButton>,
        ]}
        width={700}
      >
        {selectedRequest && (
          <div>
            <InfoCard title="Request Information">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Request ID</div>
                  <div>
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
                      {selectedRequest.id}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Patient</div>
                  <div className="font-medium">{selectedRequest.patient}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">MRN</div>
                  <div>
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
                      {selectedRequest.mrn}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Test Type</div>
                  <div className="font-medium">{selectedRequest.testType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Requested By</div>
                  <div>{selectedRequest.requestedBy}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Department</div>
                  <div>{selectedRequest.department}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Priority</div>
                  <div>
                    <StatusTag status={selectedRequest.priority.toLowerCase()} type="lab" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Request Date</div>
                  <div>{selectedRequest.requestDate}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div>
                    <StatusTag status={selectedRequest.status.toLowerCase()} type="lab" showIcon />
                  </div>
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Clinical Information">
              <p>{selectedRequest.clinicalInfo}</p>
            </InfoCard>

            {selectedRequest.status === 'Rejected' && selectedRequest.rejectionReason && (
              <InfoCard title="Rejection Reason">
                <p style={{ color: '#EF4444' }}>{selectedRequest.rejectionReason}</p>
              </InfoCard>
            )}
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
