'use client';

import React, { useState, useMemo } from 'react';
import { Space, Drawer, Descriptions, Modal, Form, Input, Select, Alert, Divider, Button, Typography } from 'antd';
import { EyeOutlined, DownloadOutlined, PrinterOutlined, PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { PageShell, StatCard, ModernTable, SearchFilterBar, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text, Title } = Typography;

interface InvoiceItem {
  id: string;
  service: string;
  date: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  mrn: string;
  type: 'Outpatient' | 'Inpatient' | 'Pharmacy' | 'Laboratory' | 'Package';
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  invoiceDate: string;
  dueDate: string;
  paidAmount: number;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-0042',
    patientName: 'Chukwuemeka Okonkwo',
    mrn: 'MRN-2024-0001',
    type: 'Inpatient',
    items: [
      { id: 'i1', service: 'Room Charges (5 days)', date: '2024-01-25', amount: 75000 },
      { id: 'i2', service: 'Nursing Care', date: '2024-01-25', amount: 10000 },
      { id: 'i3', service: 'Medication', date: '2024-01-26', amount: 15000 },
      { id: 'i4', service: 'Lab Tests', date: '2024-01-27', amount: 12000 },
      { id: 'i5', service: 'Doctor Consultation', date: '2024-01-28', amount: 10000 },
    ],
    subtotal: 122000,
    discount: 0,
    tax: 12200,
    total: 134200,
    status: 'paid',
    invoiceDate: '2024-02-01',
    dueDate: '2024-02-15',
    paidAmount: 134200,
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-0041',
    patientName: 'Amaka Okafor',
    mrn: 'MRN-2024-0002',
    type: 'Outpatient',
    items: [
      { id: 'i1', service: 'Consultation', date: '2024-02-01', amount: 10000 },
      { id: 'i2', service: 'ECG', date: '2024-02-01', amount: 5000 },
      { id: 'i3', service: 'Echocardiogram', date: '2024-02-01', amount: 15000 },
    ],
    subtotal: 30000,
    discount: 3000,
    tax: 2700,
    total: 29700,
    status: 'partial',
    invoiceDate: '2024-02-01',
    dueDate: '2024-02-15',
    paidAmount: 15000,
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-0040',
    patientName: 'Tobi Okafor',
    mrn: 'MRN-2024-0007',
    type: 'Package',
    items: [
      { id: 'i1', service: 'Basic Health Checkup Package', date: '2024-01-28', amount: 12000 },
    ],
    subtotal: 12000,
    discount: 0,
    tax: 1080,
    total: 13080,
    status: 'pending',
    invoiceDate: '2024-01-28',
    dueDate: '2024-02-11',
    paidAmount: 0,
  },
];

export default function BillingPage() {
  const { user, hasPermission } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        inv.patientName.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = !statusFilter || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('billing:invoices:view')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access billing management. This area is restricted to billing staff and administrators only."
          type="error"
          showIcon
          className="mt-6 rounded-xl"
        />
      </div>
    );
  }

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: 'Invoice #',
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
      title: 'Patient',
      key: 'patient',
      render: (_: any, record: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{record.patientName}</div>
          <div className="text-xs text-gray-500">{record.mrn}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            background: '#F1F5F9',
            color: '#475569',
          }}
        >
          {type}
        </span>
      ),
    },
    { title: 'Invoice Date', dataIndex: 'invoiceDate', key: 'invoiceDate' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (amount: number) => (
        <span className="font-semibold text-gray-900">₦{amount.toLocaleString()}</span>
      ),
      sorter: (a: Invoice, b: Invoice) => a.total - b.total,
    },
    {
      title: 'Paid',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      render: (amount: number, record: Invoice) => {
        const percentage = Math.round((amount / record.total) * 100);
        return (
          <div>
            <div>₦{amount.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{percentage}%</div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="billing" showIcon />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Invoice) => (
        <Space>
          <GradientButton variant="secondary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </GradientButton>
        </Space>
      ),
    },
  ];

  const stats = {
    totalRevenue: 85000000,
    pendingPayments: 13500000,
    overdueAmount: 3750000,
    paidToday: 2625000,
    totalInvoices: mockInvoices.length,
    pending: mockInvoices.filter((i: any) => i.status === 'pending').length,
    partial: mockInvoices.filter((i: any) => i.status === 'partial').length,
    paid: mockInvoices.filter((i: any) => i.status === 'paid').length,
  };

  return (
    <PageShell
      title="Billing Dashboard"
      subtitle="Monitor revenue, track payments, and manage billing operations"
      action={
        <GradientButton icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)} className="w-full sm:w-auto">
          Create Invoice
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Revenue (Feb)"
          value={stats.totalRevenue}
          prefix="₦"
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={0}
        />
        <StatCard
          label="Pending Payments"
          value={stats.pendingPayments}
          prefix="₦"
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={1}
        />
        <StatCard
          label="Overdue Amount"
          value={stats.overdueAmount}
          prefix="₦"
          color="#EF4444"
          bg="linear-gradient(135deg, #FEE2E2 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCA5A5"
          index={2}
        />
        <StatCard
          label="Paid Today"
          value={stats.paidToday}
          prefix="₦"
          color="#0077B6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={3}
        />
      </div>

      {/* Invoice List Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-6 border border-slate-200">
        <SearchFilterBar
          searchPlaceholder="Search invoices by number or patient..."
          searchValue={searchText}
          onSearchChange={setSearchText}
          filters={[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { label: 'All Status', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Pending', value: 'pending' },
                { label: 'Partial', value: 'partial' },
                { label: 'Paid', value: 'paid' },
                { label: 'Overdue', value: 'overdue' },
              ],
              onChange: (value) => setStatusFilter(value as string | undefined),
            },
          ]}
          resultCount={filteredInvoices.length}
          totalCount={mockInvoices.length}
          filterLabel="invoices"
        />

        <div className="overflow-x-auto">
          <ModernTable
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="id"
            pagination={{ defaultPageSize: 15 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      {/* Invoice Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <DollarOutlined style={{ color: '#059669' }} />
            <span>{selectedInvoice?.invoiceNumber}</span>
          </div>
        }
        placement="right"
        size="large"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedInvoice(null);
        }}
      >
        {selectedInvoice && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Patient">{selectedInvoice.patientName}</Descriptions.Item>
              <Descriptions.Item label="MRN">{selectedInvoice.mrn}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedInvoice.type}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <StatusTag status={selectedInvoice.status} type="billing" showIcon />
              </Descriptions.Item>
              <Descriptions.Item label="Invoice Date">{selectedInvoice.invoiceDate}</Descriptions.Item>
              <Descriptions.Item label="Due Date">{selectedInvoice.dueDate}</Descriptions.Item>
            </Descriptions>

            <Divider>Invoice Items</Divider>
            <div className="mt-4">
              {selectedInvoice.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div>
                    <div className="font-medium">{item.service}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                  <div className="font-semibold">₦{item.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <Divider />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <Text type="secondary">Subtotal:</Text>
                <Text>₦{selectedInvoice.subtotal.toLocaleString()}</Text>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between">
                  <Text type="secondary">Discount:</Text>
                  <Text type="danger">-₦{selectedInvoice.discount.toLocaleString()}</Text>
                </div>
              )}
              <div className="flex justify-between">
                <Text type="secondary">Tax (10%):</Text>
                <Text>₦{selectedInvoice.tax.toLocaleString()}</Text>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderTop: '1px solid #f0f0f0' }}>
                <Text strong>Total:</Text>
                <Text strong className="text-lg">₦{selectedInvoice.total.toLocaleString()}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Paid:</Text>
                <Text type="success">₦{selectedInvoice.paidAmount.toLocaleString()}</Text>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderTop: '1px solid #f0f0f0' }}>
                <Text strong>Balance Due:</Text>
                <Text strong className="text-lg text-red-600">
                  ₦{(selectedInvoice.total - selectedInvoice.paidAmount).toLocaleString()}
                </Text>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <GradientButton icon={<DownloadOutlined />} className="w-full sm:w-auto">Download PDF</GradientButton>
              <GradientButton variant="secondary" icon={<PrinterOutlined />} className="w-full sm:w-auto">Print</GradientButton>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Invoice Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined style={{ color: '#3B82F6' }} />
            <span>Create New Invoice</span>
          </div>
        }
        open={createModalVisible}
        onOk={() => {}}
        onCancel={() => setCreateModalVisible(false)}
        width={800}
      >
        <Form layout="vertical" className="mt-6">
          <Form.Item label="Patient" rules={[{ required: true }]}>
            <Select placeholder="Select patient" showSearch>
              <Select.Option value="1">Chukwuemeka Okonkwo (MRN-2024-0001)</Select.Option>
              <Select.Option value="2">Amaka Okafor (MRN-2024-0002)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Invoice Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="outpatient">Outpatient</Select.Option>
              <Select.Option value="inpatient">Inpatient</Select.Option>
              <Select.Option value="pharmacy">Pharmacy</Select.Option>
              <Select.Option value="laboratory">Laboratory</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
