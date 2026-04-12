'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Progress, Steps, Alert, Input } from 'antd';
import { EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';

interface LabWorkflow {
  id: string;
  sampleId: string;
  patientName: string;
  mrn: string;
  test: string;
  priority: 'routine' | 'urgent' | 'stat';
  stage: string;
  status: 'pending' | 'processing' | 'verified' | 'approved';
  orderedDate: string;
  estimatedCompletion: string;
  collectedDate?: string;
  startedDate?: string;
  completedDate?: string;
  pathologist?: string;
  verifiedBy?: string;
}

export default function LabWorkflowPage() {
  const { user, hasPermission } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>();
  const [selectedItem, setSelectedItem] = useState<LabWorkflow | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // CRITICAL SECURITY: Restrict access to laboratory workflow
  if (!hasPermission('laboratory:workflow:view')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 ">
        <Alert
          message="Access Denied"
          description="You don&apos;tt have permission to access laboratory workflow. This area is restricted to laboratory staff."
          type="error"
          showIcon
          className=" "
        />
      </div>
    );
  }

  const [items] = useState<LabWorkflow[]>([
    {
      id: '1',
      sampleId: 'LAB-2024-0150',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      test: 'Complete Blood Count + Differential',
      priority: 'routine',
      stage: 'Verification',
      status: 'verified',
      orderedDate: '2024-02-05 08:00',
      estimatedCompletion: '2024-02-05 10:00',
      collectedDate: '2024-02-05 08:15',
      startedDate: '2024-02-05 08:30',
      completedDate: '2024-02-05 09:45',
      pathologist: 'Dr. Emily Johnson'
    },
    {
      id: '2',
      sampleId: 'LAB-2024-0151',
      patientName: 'Grace Adeleke',
      mrn: 'MRN-2024-0015',
      test: 'Comprehensive Metabolic Panel',
      priority: 'urgent',
      stage: 'Analysis',
      status: 'processing',
      orderedDate: '2024-02-05 09:30',
      estimatedCompletion: '2024-02-05 11:30',
      collectedDate: '2024-02-05 09:45',
      startedDate: '2024-02-05 10:00'
    },
    {
      id: '3',
      sampleId: 'LAB-2024-0152',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      test: 'Troponin I',
      priority: 'stat',
      stage: 'Sample Processing',
      status: 'pending',
      orderedDate: '2024-02-05 10:15',
      estimatedCompletion: '2024-02-05 10:45'
    },
    {
      id: '4',
      sampleId: 'LAB-2024-0153',
      patientName: 'Fatima Ibrahim',
      mrn: 'MRN-2024-0022',
      test: 'CBC',
      priority: 'routine',
      stage: 'Review',
      status: 'approved',
      orderedDate: '2024-02-05 07:45',
      estimatedCompletion: '2024-02-05 09:45',
      collectedDate: '2024-02-05 08:00',
      startedDate: '2024-02-05 08:15',
      completedDate: '2024-02-05 09:00',
      pathologist: 'Dr. Michael Chen',
      verifiedBy: 'Dr. Sarah Williams'
    },
    {
      id: '5',
      sampleId: 'LAB-2024-0154',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-2024-0002',
      test: 'Lipid Panel',
      priority: 'urgent',
      stage: 'Analysis',
      status: 'processing',
      orderedDate: '2024-02-05 10:30',
      estimatedCompletion: '2024-02-05 12:30',
      collectedDate: '2024-02-05 10:45',
      startedDate: '2024-02-05 11:00'
    },
    {
      id: '6',
      sampleId: 'LAB-2024-0155',
      patientName: 'Emeka Nnamdi',
      mrn: 'MRN-2024-0018',
      test: 'HbA1c',
      priority: 'routine',
      stage: 'Collection',
      status: 'pending',
      orderedDate: '2024-02-05 11:00',
      estimatedCompletion: '2024-02-05 13:00'
    },
  ]);

  const stats = useMemo(() => ({
    pending: items.filter(i => i.status === 'pending').length,
    processing: items.filter(i => i.status === 'processing').length,
    verified: items.filter(i => i.status === 'verified').length,
    approved: items.filter(i => i.status === 'approved').length,
    urgent: items.filter(i => i.priority === 'urgent').length,
    stat: items.filter(i => i.priority === 'stat').length
  }), [items]);

  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                           i.sampleId.toLowerCase().includes(searchText.toLowerCase()) ||
                           i.test.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || i.status === statusFilter;
      const matchesPriority = !priorityFilter || i.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [items, searchText, statusFilter, priorityFilter]);

  const columns = [
    {
      title: 'Sample ID',
      dataIndex: 'sampleId',
      key: 'sampleId',
      render: (id: string) => (
        <span
          style={{
            padding: '4px 10px',
            
                        fontWeight: 500,
            background: '#DBEAFE',
                      }}
        >
          {id}
        </span>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, r: LabWorkflow) => (
        <div>
          <div className="font-medium">{r.patientName}</div>
          <div className=" ">{r.mrn}</div>
        </div>
      )
    },
    {
      title: 'Test',
      dataIndex: 'test',
      key: 'test',
      render: (t: string) => <span className="font-medium">{t}</span>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p: string) => {
        const color = p === 'stat' ? '#EF4444' : p === 'urgent' ? '#F59E0B' : '#64748B';
        const bg = p === 'stat' ? '#FEE2E2' : p === 'urgent' ? '#FEF3C7' : '#F1F5F9';
        const icon = p === 'stat' ? <ExclamationCircleOutlined /> : p === 'urgent' ? <ClockCircleOutlined /> : null;
        return (
          <span
            style={{
              padding: '4px 10px',
              
                            fontWeight: 500,
              background: bg,
              color,
            }}
          >
            {icon} {p.toUpperCase()}
          </span>
        );
      }
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (s: string) => <StatusTag status={s.toLowerCase().replace(' ', '_')} type="lab" />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <StatusTag status={s} type="lab" showIcon />
    },
    {
      title: 'Est. Complete',
      dataIndex: 'estimatedCompletion',
      key: 'estimatedCompletion',
      render: (date: string) => {
        const now = new Date();
        const estDate = new Date(date);
        const isOverdue = estDate < now;
        return (
          <span style={{ color: isOverdue ? '#EF4444' : '#64748B' }}>
            {date}
          </span>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, r: LabWorkflow) => (
        <GradientButton
          variant="secondary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedItem(r);
            setDrawerVisible(true);
          }}
        >
          View
        </GradientButton>
      ),
    },
  ];

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'verified': return 75;
      case 'approved': return 100;
      default: return 0;
    }
  };

  const getWorkflowSteps = (item: LabWorkflow) => {
    const steps = [
      { title: 'Ordered', status: 'finish' as const, description: item.orderedDate },
      { title: 'Collected', status: item.collectedDate ? 'finish' as const : 'wait' as const, description: item.collectedDate || 'Pending' },
      { title: 'Processing', status: item.status === 'pending' ? 'wait' as const : 'process' as const, description: item.stage },
      { title: 'Verified', status: item.status === 'verified' || item.status === 'approved' ? 'finish' as const : 'wait' as const, description: item.pathologist || 'Pending' },
      { title: 'Approved', status: item.status === 'approved' ? 'finish' as const : 'wait' as const, description: item.verifiedBy || 'Pending' },
    ];
    return steps;
  };

  return (
    <PageShell
      title="Laboratory Workflow Management"
      subtitle="Track sample processing from collection to result approval"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
        <StatCard
          label="Pending"
          value={stats.pending}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={0}
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={1}
        />
        <StatCard
          label="Verified"
          value={stats.verified}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={2}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={3}
        />
      </div>

      {/* Urgent Alert */}
      {(stats.stat > 0 || stats.urgent > 0) && (
        <Alert
          message={`${stats.stat + stats.urgent} urgent/critical sample${stats.stat + stats.urgent > 1 ? 's' : ''} awaiting processing`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: '24px', borderRadius: '12px' }}
        />
      )}

      {/* Workflow Queue */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <h3 className=" font-semibold  ">Workflow Queue</h3>

        <SearchFilterBar
          searchPlaceholder="Search patients, tests, or samples..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Pending', value: 'pending' },
                { label: 'Processing', value: 'processing' },
                { label: 'Verified', value: 'verified' },
                { label: 'Approved', value: 'approved' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
            {
              key: 'priority',
              label: 'Priority',
              value: priorityFilter,
              options: [
                { label: 'All Priority', value: '' },
                { label: 'Routine', value: 'routine' },
                { label: 'Urgent', value: 'urgent' },
                { label: 'STAT', value: 'stat' },
              ],
              onChange: (value) => setPriorityFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredItems.length}
          totalCount={items.length}
          filterLabel="samples"
        />

        <ModernTable
          dataSource={filteredItems}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          rowClassName={(record) => {
            if (record.priority === 'stat') return 'bg-red-50';
            if (record.priority === 'urgent') return 'bg-orange-50';
            return '';
          }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="Workflow Details"
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedItem(null);
        }}
      >
        {selectedItem && (
          <div>
            <InfoCard title="Sample Information">
              <div className="grid grid-cols-2 ">
                <div>
                  <div className="  ">Sample ID</div>
                  <div>
                    <span
                      style={{
                        padding: '4px 10px',
                        
                                                fontWeight: 500,
                        background: '#DBEAFE',
                                              }}
                    >
                      {selectedItem.sampleId}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="  ">Patient</div>
                  <div className="text font-semibold">{selectedItem.patientName}</div>
                  <div className=" ">{selectedItem.mrn}</div>
                </div>
                <div>
                  <div className="  ">Test</div>
                  <div className="font-medium">{selectedItem.test}</div>
                </div>
                <div>
                  <div className="  ">Priority</div>
                  <div>
                    <StatusTag status={selectedItem.priority} type="lab" />
                  </div>
                </div>
                <div>
                  <div className="  ">Current Stage</div>
                  <div>
                    <StatusTag status={selectedItem.stage.toLowerCase().replace(' ', '_')} type="lab" />
                  </div>
                </div>
                <div>
                  <div className="  ">Status</div>
                  <div>
                    <StatusTag status={selectedItem.status} type="lab" showIcon />
                  </div>
                </div>
                <div>
                  <div className="  ">Ordered</div>
                  <div>{selectedItem.orderedDate}</div>
                </div>
                <div>
                  <div className="  ">Est. Completion</div>
                  <div>{selectedItem.estimatedCompletion}</div>
                </div>
                <div className="col-span-2">
                  <div className="  ">Progress</div>
                  <Progress
                    percent={getStatusProgress(selectedItem.status)}
                    status={selectedItem.status === 'pending' ? 'exception' : 'active'}
                    strokeColor={selectedItem.status === 'approved' ? '#10B981' : '#3B82F6'}
                  />
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Workflow Timeline">
              <Steps
                current={getStatusProgress(selectedItem.status) / 25}
                items={getWorkflowSteps(selectedItem)}
                direction="vertical"
              />
            </InfoCard>

            {selectedItem.status !== 'pending' && (
              <InfoCard title="Processing Details">
                <div className="grid grid-cols-2 ">
                  {selectedItem.collectedDate && (
                    <div>
                      <div className="  ">Collected At</div>
                      <div className="font-medium">{selectedItem.collectedDate}</div>
                    </div>
                  )}
                  {selectedItem.startedDate && (
                    <div>
                      <div className="  ">Started Processing</div>
                      <div className="font-medium">{selectedItem.startedDate}</div>
                    </div>
                  )}
                  {selectedItem.completedDate && (
                    <div>
                      <div className="  ">Completed At</div>
                      <div className="font-medium">{selectedItem.completedDate}</div>
                    </div>
                  )}
                  {selectedItem.pathologist && (
                    <div>
                      <div className="  ">Pathologist</div>
                      <div className="font-medium">{selectedItem.pathologist}</div>
                    </div>
                  )}
                  {selectedItem.verifiedBy && (
                    <div>
                      <div className="  ">Verified By</div>
                      <div className="font-medium">{selectedItem.verifiedBy}</div>
                    </div>
                  )}
                </div>
              </InfoCard>
            )}

            <div className="  ">
              <GradientButton icon={<CheckCircleOutlined />}>
                {selectedItem.status === 'pending' ? 'Start Processing' :
                 selectedItem.status === 'processing' ? 'For Verification' :
                 selectedItem.status === 'verified' ? 'For Approval' : 'Complete'}
              </GradientButton>
            </div>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
