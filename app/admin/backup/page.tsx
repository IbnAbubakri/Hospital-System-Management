'use client';

import React from 'react';
import { Table, Button, Space, Progress, Modal, App } from 'antd';
import { DownloadOutlined, CloudUploadOutlined, DeleteOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PageShell, StatCard, ModernTable, StatusTag, GradientButton, InfoCard } from '@/components/design-system';
import { Alert } from 'antd';

export default function BackupPage() {
  const { user, hasPermission } = useAuth();
  const [isBackupModalVisible, setIsBackupModalVisible] = React.useState(false);
  const { message } = App.useApp();
  const [backupInProgress, setBackupInProgress] = React.useState(false);

  // CRITICAL SECURITY: Restrict access to administrators only
  if (!hasPermission('admin:backup:view')) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)', padding: '16px' }}>
        <Alert
          title="Access Denied"
          description="You don&apos;tt have permission to access backup management. This area is restricted to administrators only."
          type="error"
          showIcon
          icon={<StopOutlined />}
          style={{ marginTop: '24px', borderRadius: '12px' }}
        />
      </div>
    );
  }

  const backups = [
    { id: 1, name: 'Full_Backup_20240205', type: 'full', date: '2024-02-05 02:00:00', size: '2.4 GB', location: 'Local', status: 'completed', duration: '00:15:32' },
    { id: 2, name: 'Incremental_20240204', type: 'incremental', date: '2024-02-04 02:00:00', size: '156 MB', location: 'Cloud', status: 'completed', duration: '00:02:45' },
    { id: 3, name: 'Full_Backup_20240204', type: 'full', date: '2024-02-04 02:00:00', size: '2.3 GB', location: 'Local', status: 'completed', duration: '00:14:58' },
    { id: 4, name: 'Incremental_20240203', type: 'incremental', date: '2024-02-03 02:00:00', size: '142 MB', location: 'Cloud', status: 'completed', duration: '00:02:30' },
    { id: 5, name: 'Full_Backup_20240203', type: 'full', date: '2024-02-03 02:00:00', size: '2.3 GB', location: 'Local', status: 'failed', duration: '-' },
  ];

  const schedules = [
    { id: 1, name: 'Daily Full Backup', frequency: 'Daily', time: '02:00', type: 'full', nextRun: '2024-02-06 02:00', status: 'active' },
    { id: 2, name: 'Hourly Incremental', frequency: 'Hourly', time: '00:00', type: 'incremental', nextRun: '2024-02-05 15:00', status: 'active' },
    { id: 3, name: 'Weekly Archive', frequency: 'Weekly', time: '03:00', type: 'full', nextRun: '2024-02-11 03:00', status: 'active' },
  ];

  const backupColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Backup Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <StatusTag status={type} type="appointment" />
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => <StatusTag status={loc} type="patient" />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<DownloadOutlined />}>Download</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      )
    },
  ];

  const scheduleColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Schedule Name', dataIndex: 'name', key: 'name' },
    { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <StatusTag status={type} type="appointment" />
    },
    { title: 'Next Run', dataIndex: 'nextRun', key: 'nextRun' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} type="patient" showIcon />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" size="small">Edit</Button>
          <Button type="link" size="small" danger>Disable</Button>
        </Space>
      )
    },
  ];

  const handleBackup = () => {
    setBackupInProgress(true);
    setTimeout(() => {
      setBackupInProgress(false);
      setIsBackupModalVisible(false);
      message.success('Backup completed successfully');
    }, 3000);
  };

  const completedBackups = backups.filter(b => b.status === 'completed').length;
  const totalSize = 5.2;
  const avgDuration = 11;

  return (
    <PageShell
      title="Backup & Restore"
      subtitle="Manage data backups, schedules, and restoration"
      action={
        <GradientButton
          icon={<PlayCircleOutlined />}
          onClick={() => setIsBackupModalVisible(true)}
          className="w-full sm:w-auto"
        >
          Create Backup
        </GradientButton>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Backups"
          value={backups.length}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Completed"
          value={completedBackups}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={1}
        />
        <StatCard
          label="Total Size"
          value={totalSize}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
          suffix="GB"
        />
        <StatCard
          label="Avg Duration"
          value={avgDuration}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={3}
          suffix="min"
        />
      </div>

      {/* Storage Status Section */}
      <div className="overflow-x-auto" style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Storage Status"
          icon={<CloudUploadOutlined style={{ color: '#3B82F6' }} />}
        >
        <Space size="large" style={{ width: '100%' }}>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Local Storage</span>
              <span className="text-gray-600">75 GB / 100 GB</span>
            </div>
            <Progress
              percent={75}
              strokeColor="#3B82F6"
              style={{ marginBottom: '8px' }}
            />
            <div className="text-sm text-gray-500">75% used</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Cloud Storage</span>
              <span className="text-gray-600">45 GB / 500 GB</span>
            </div>
            <Progress
              percent={9}
              strokeColor="#10B981"
              style={{ marginBottom: '8px' }}
            />
            <div className="text-sm text-gray-500">9% used</div>
          </div>
        </Space>
        </InfoCard>
      </div>

      {/* Backup Schedule Section */}
      <div className="overflow-x-auto" style={{ marginBottom: '24px' }}>
        <InfoCard
          title="Backup Schedule"
          icon={<PlayCircleOutlined style={{ color: '#8B5CF6' }} />}
        >
        <ModernTable
          dataSource={schedules}
          columns={scheduleColumns}
          rowKey="id"
          pagination={false}
        />
        </InfoCard>
      </div>

      {/* Backup History Section */}
      <InfoCard
        title="Backup History"
        icon={<CloudUploadOutlined style={{ color: '#10B981' }} />}
      >
        <ModernTable
          dataSource={backups}
          columns={backupColumns}
          rowKey="id"
          pagination={{ defaultPageSize: 10 }}
        />
      </InfoCard>

      {/* Create Backup Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloudUploadOutlined style={{ color: '#3B82F6' }} />
            <span>Create New Backup</span>
          </div>
        }
        open={isBackupModalVisible}
        onOk={handleBackup}
        onCancel={() => setIsBackupModalVisible(false)}
        okButtonProps={{ loading: backupInProgress }}
      >
        {backupInProgress ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Progress percent={66} status="active" strokeColor="#3B82F6" />
            <p className="mt-4 text-gray-600">Creating backup...</p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">Select backup type:</p>
            <Space orientation="vertical" style={{ width: '100%' }}>
              <GradientButton
                variant="secondary"
                block
                icon={<CloudUploadOutlined />}
                onClick={handleBackup}
              >
                Full Backup
              </GradientButton>
              <GradientButton
                variant="secondary"
                block
                icon={<CloudUploadOutlined />}
                onClick={handleBackup}
              >
                Incremental Backup
              </GradientButton>
              <GradientButton
                variant="secondary"
                block
                icon={<CloudUploadOutlined />}
                onClick={handleBackup}
              >
                Differential Backup
              </GradientButton>
            </Space>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
