'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Table, Input, Button, Select, Drawer, Typography, Row, Col, Steps, Progress, Badge, Descriptions, Divider } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, DollarOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;

interface CollectionAccount {
  id: string;
  patientName: string;
  mrn: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  status: 'new' | 'contacted' | 'promised' | 'disputed' | 'escalated' | 'collected' | 'written_off';
  stage: number;
  lastContact: string;
  contactAttempts: number;
  notes: string;
}

interface CollectionActivity {
  id: string;
  date: string;
  type: 'call' | 'email' | 'sms' | 'letter' | 'payment' | 'note';
  description: string;
  user: string;
}

export default function CollectionsWorkflowPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<CollectionAccount | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Status tag configuration for collections
  const collectionStatusConfig = {
    'new': { color: '#6B7280', bg: '#F3F4F6', icon: <ClockCircleOutlined /> },
    'contacted': { color: '#3B82F6', bg: '#DBEAFE', icon: <PhoneOutlined /> },
    'promised': { color: '#06B6D4', bg: '#CFFAFE', icon: <CheckCircleOutlined /> },
    'disputed': { color: '#F59E0B', bg: '#FEF3C7', icon: <ExclamationCircleOutlined /> },
    'escalated': { color: '#EF4444', bg: '#FEE2E2', icon: <ExclamationCircleOutlined /> },
    'collected': { color: '#10B981', bg: '#D1FAE5', icon: <CheckCircleOutlined /> },
    'written_off': { color: '#6B7280', bg: '#F3F4F6', icon: <ExclamationCircleOutlined /> },
  };

  const [collectionAccounts] = useState<CollectionAccount[]>([
    {
      id: '1',
      patientName: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      invoiceNumber: 'INV-2024-0042',
      invoiceDate: '2024-01-15',
      dueDate: '2024-01-30',
      amount: 450000,
      balance: 450000,
      status: 'contacted',
      stage: 2,
      lastContact: '2024-02-03',
      contactAttempts: 2,
      notes: 'Patient promised to pay by end of week',
    },
    {
      id: '2',
      patientName: 'Amaka Okafor',
      mrn: 'MRN-2024-0002',
      invoiceNumber: 'INV-2024-0038',
      invoiceDate: '2024-01-10',
      dueDate: '2024-01-25',
      amount: 125000,
      balance: 75000,
      status: 'promised',
      stage: 3,
      lastContact: '2024-02-04',
      contactAttempts: 3,
      notes: 'Payment arrangement agreed - ₦50,000 on 5th, remainder on 12th',
    },
    {
      id: '3',
      patientName: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      invoiceNumber: 'INV-2024-0035',
      invoiceDate: '2024-01-05',
      dueDate: '2024-01-20',
      amount: 280000,
      balance: 280000,
      status: 'escalated',
      stage: 5,
      lastContact: '2024-02-01',
      contactAttempts: 6,
      notes: 'No response to multiple attempts. Recommend external collection agency',
    },
    {
      id: '4',
      patientName: 'Grace Adeleke',
      mrn: 'MRN-2024-0015',
      invoiceNumber: 'INV-2024-0045',
      invoiceDate: '2024-01-28',
      dueDate: '2024-02-12',
      amount: 85000,
      balance: 85000,
      status: 'new',
      stage: 1,
      lastContact: '-',
      contactAttempts: 0,
      notes: 'Recently overdue. Initial contact needed',
    },
    {
      id: '5',
      patientName: 'Emeka Nnamdi',
      mrn: 'MRN-2024-0018',
      invoiceNumber: 'INV-2024-0040',
      invoiceDate: '2024-01-12',
      dueDate: '2024-01-27',
      amount: 195000,
      balance: 195000,
      status: 'disputed',
      stage: 4,
      lastContact: '2024-02-02',
      contactAttempts: 4,
      notes: 'Patient disputes certain charges. Billing review needed',
    },
    {
      id: '6',
      patientName: 'Fatima Ibrahim',
      mrn: 'MRN-2024-0022',
      invoiceNumber: 'INV-2024-0032',
      invoiceDate: '2023-12-28',
      dueDate: '2024-01-12',
      amount: 340000,
      balance: 0,
      status: 'collected',
      stage: 6,
      lastContact: '2024-01-25',
      contactAttempts: 5,
      notes: 'Full payment received via bank transfer',
    },
  ]);

  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    newItems: 0,
    inProgress: 0,
    collected: 0,
    outstanding: 0,
  });

  const stats = useMemo(() => {
    const total = collectionAccounts.length;
    const newItems = collectionAccounts.filter((a: any) => a.status === 'new').length;
    const inProgress = collectionAccounts.filter((a: any) =>
      ['contacted', 'promised', 'disputed'].includes(a.status)
    ).length;
    const collected = collectionAccounts.filter((a: any) => a.status === 'collected').length;
    const outstanding = collectionAccounts.reduce((sum, a) => sum + a.balance, 0);

    return { total, newItems, inProgress, collected, outstanding };
  }, [collectionAccounts]);

  useEffect(() => {
    setMounted(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    const currentValues = { ...animatedStats };
    const targets = stats;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        total: Math.round(currentValues.total + (targets.total - currentValues.total) * easeProgress),
        newItems: Math.round(currentValues.newItems + (targets.newItems - currentValues.newItems) * easeProgress),
        inProgress: Math.round(currentValues.inProgress + (targets.inProgress - currentValues.inProgress) * easeProgress),
        collected: Math.round(currentValues.collected + (targets.collected - currentValues.collected) * easeProgress),
        outstanding: Math.round(currentValues.outstanding + (targets.outstanding - currentValues.outstanding) * easeProgress),
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const filteredAccounts = useMemo(() => {
    return collectionAccounts.filter((account) => {
      const matchesSearch =
        account.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
        account.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        account.mrn.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || account.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter, collectionAccounts]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      'new': { color: 'default', icon: <ClockCircleOutlined />, label: 'New' },
      'contacted': { color: 'blue', icon: <DollarOutlined />, label: 'Contacted' },
      'promised': { color: 'cyan', icon: <CheckCircleOutlined />, label: 'Promised' },
      'disputed': { color: 'orange', icon: <ExclamationCircleOutlined />, label: 'Disputed' },
      'escalated': { color: 'error', icon: <ExclamationCircleOutlined />, label: 'Escalated' },
      'collected': { color: 'success', icon: <CheckCircleOutlined />, label: 'Collected' },
      'written_off': { color: 'default', icon: <ExclamationCircleOutlined />, label: 'Written Off' },
    };
    return configs[status] || configs.new;
  };

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: CollectionAccount) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <Text type="secondary" className="text-xs">{record.mrn}</Text>
        </div>
      ),
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (num: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#DBEAFE',
            color: '#1E40AF',
          }}
        >
          {num}
        </span>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (amount: number) => (
        <span className="font-semibold text-red-600">₦{amount.toLocaleString()}</span>
      ),
      sorter: (a: CollectionAccount, b: CollectionAccount) => a.balance - b.balance,
    },
    {
      title: 'Stage',
      key: 'stage',
      render: (_: any, record: CollectionAccount) => (
        <Progress
          percent={(record.stage / 6) * 100}
          size="small"
          showInfo={false}
          strokeColor={record.stage >= 5 ? '#EF4444' : '#3B82F6'}
        />
      ),
    },
    {
      title: 'Contact Attempts',
      dataIndex: 'contactAttempts',
      key: 'contactAttempts',
      render: (attempts: number) => <Badge count={attempts} style={{ backgroundColor: attempts > 5 ? '#EF4444' : '#3B82F6' }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <StatusTag
          status={status}
          customConfig={collectionStatusConfig}
          showIcon
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CollectionAccount) => (
        <GradientButton
          variant="secondary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedAccount(record);
            setDrawerVisible(true);
          }}
        >
          View
        </GradientButton>
      ),
    },
  ];

  return (
    <PageShell
      title="Collections Workflow"
      subtitle="Manage and track accounts receivable collection process"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Accounts"
          value={animatedStats.total}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="New Accounts"
          value={animatedStats.newItems}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={1}
        />
        <StatCard
          label="In Progress"
          value={animatedStats.inProgress}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#DDD6FE"
          index={2}
        />
        <StatCard
          label="Collected"
          value={animatedStats.collected}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* Collection Accounts Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' }}>
        <SearchFilterBar
          searchPlaceholder="Search accounts by patient, invoice, or MRN..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'New', value: 'new' },
                { label: 'Contacted', value: 'contacted' },
                { label: 'Promised', value: 'promised' },
                { label: 'Disputed', value: 'disputed' },
                { label: 'Escalated', value: 'escalated' },
                { label: 'Collected', value: 'collected' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredAccounts.length}
          totalCount={collectionAccounts.length}
          filterLabel="accounts"
        />

        <ModernTable
          dataSource={filteredAccounts}
          columns={columns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <DollarOutlined style={{ color: '#059669' }} />
            <span>Collection Account Details</span>
          </div>
        }
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedAccount(null);
        }}
      >
        {selectedAccount && (
          <div>
            <InfoCard
              title="Account Information"
              icon={<UserOutlined />}
              color="#3B82F6"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Patient">{selectedAccount.patientName}</Descriptions.Item>
                <Descriptions.Item label="MRN">{selectedAccount.mrn}</Descriptions.Item>
                <Descriptions.Item label="Invoice Number">
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      background: '#DBEAFE',
                      color: '#1E40AF',
                    }}
                  >
                    {selectedAccount.invoiceNumber}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <StatusTag
                    status={selectedAccount.status}
                    customConfig={collectionStatusConfig}
                    showIcon
                  />
                </Descriptions.Item>
              </Descriptions>
            </InfoCard>

            <InfoCard
              title="Collection Progress"
              icon={<CheckCircleOutlined />}
              color="#8B5CF6"
            >
              <Steps
                current={selectedAccount.stage - 1}
                size="small"
                items={[
                  { title: 'New' },
                  { title: 'Contacted' },
                  { title: 'Promised' },
                  { title: 'Follow-up' },
                  { title: 'Escalated' },
                  { title: 'Resolved' },
                ]}
              />
              <div className="mt-4">
                <Text type="secondary">Contact Attempts: </Text>
                <Badge count={selectedAccount.contactAttempts} style={{ backgroundColor: selectedAccount.contactAttempts > 5 ? '#EF4444' : '#3B82F6' }} />
              </div>
            </InfoCard>

            <InfoCard
              title="Financial Details"
              icon={<DollarOutlined />}
              color="#10B981"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Original Amount</Text>
                    <div className="text-lg font-semibold text-gray-900">₦{selectedAccount.amount.toLocaleString()}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mb-3">
                    <Text type="secondary">Outstanding Balance</Text>
                    <div className="text-lg font-semibold text-red-600">₦{selectedAccount.balance.toLocaleString()}</div>
                  </div>
                </Col>
              </Row>
            </InfoCard>

            <InfoCard
              title="Notes & Actions"
              icon={<PhoneOutlined />}
              color="#F59E0B"
            >
              <div className="mb-4">
                <Text type="secondary">Last Contact: </Text>
                <Text strong>{selectedAccount.lastContact !== '-' ? selectedAccount.lastContact : 'Not contacted yet'}</Text>
              </div>
              <div className="mb-4">
                <Text type="secondary">Notes:</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded" style={{ background: '#F9FAFB', borderRadius: '8px' }}>
                  {selectedAccount.notes}
                </div>
              </div>
              <div className="flex gap-2">
                <GradientButton icon={<PhoneOutlined />}>Log Contact</GradientButton>
                <GradientButton variant="secondary">Send Reminder</GradientButton>
              </div>
            </InfoCard>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
