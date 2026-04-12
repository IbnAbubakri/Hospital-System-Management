'use client';

import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { MedicineBoxOutlined, FileTextOutlined, HeartOutlined, ExperimentOutlined, AlertOutlined, ScheduleOutlined, TeamOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function ClinicalPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();

  if (!hasPermission('clinical:view')) {
    return (
      <div className="min-h-screen bg-gray-50 ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Clinical Services. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const clinicalMetrics = {
    activePatients: 234,
    consultations: 156,
    prescriptions: 89,
    admissions: 12,
  };

  const ModuleCard = ({ title, description, icon, link, stats, color, bgColor }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    stats?: string;
    color: string;
    bgColor: string;
  }) => (
    <Card
      hoverable
      onClick={() => router.push(link)}
      className="-xl border-none shadow cursor-pointer h-full"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          className="  -lg   justify-content text-xl"
          className="  "
        >
          {icon}
        </div>
        <div className="-1">
          <Text strong className="text-base block ">{title}</Text>
          <Text type="secondary" className="">{description}</Text>
          {stats && (
            <div className="">
              className=" "
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <PageShell title="Clinical Services">
      <div className="bg-gray-50 min-h-screen">
      <PageHeader
        title="Clinical Services"
        badge="Patient Care"
        stats={[
          { title: 'Active Patients', value: clinicalMetrics.activePatients.toString(), change: '+12 today', icon: <HeartOutlined />, color: '#10B981', bgColor: '#ECFDF5' },
          { title: 'Consultations', value: clinicalMetrics.consultations.toString(), change: '+8 today', icon: <FileTextOutlined />, color: '#3B82F6', bgColor: '#EFF6FF' },
          { title: 'Prescriptions', value: clinicalMetrics.prescriptions.toString(), change: '+15 today', icon: <MedicineBoxOutlined />, color: '#F59E0B', bgColor: '#FFFBEB' },
          { title: 'Admissions', value: clinicalMetrics.admissions.toString(), change: '+2 today', icon: <TeamOutlined />, color: '#EF4444', bgColor: '#FEF2F2' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={12} sm={6}>
          <StatCard title="Today" value={clinicalMetrics.activePatients.toString()} label="Active patients" color="#10B981" bgColor="#ECFDF5" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Consultations" value={clinicalMetrics.consultations.toString()} label="Today" color="#3B82F6" bgColor="#EFF6FF" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Prescriptions" value={clinicalMetrics.prescriptions.toString()} label="Today" color="#F59E0B" bgColor="#FFFBEB" />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard title="Admissions" value={clinicalMetrics.admissions.toString()} label="Current" color="#EF4444" bgColor="#FEF2F2" />
        </Col>
      </Row>

      <Text strong className=" block ">Clinical Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="EMR"
            description="Electronic Medical Records and patient history"
            icon={<FileTextOutlined className="" />}
            link="/clinical/emr"
            stats="Complete Records"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Consultations"
            description="Manage patient consultations and visits"
            icon={<ScheduleOutlined className="" />}
            link="/clinical/consultations"
            stats="156 Today"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Inpatients"
            description="Manage admissions and bed occupancy"
            icon={<TeamOutlined className="text-pink-500" />}
            link="/clinical/inpatients"
            stats="12 Admitted"
            color="#EC4899"
            bgColor="#FDF2F8"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Prescriptions"
            description="Manage medication orders and dispensing"
            icon={<MedicineBoxOutlined className="" />}
            link="/clinical/prescriptions"
            stats="89 Active"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Lab Orders"
            description="Order and track laboratory tests"
            icon={<ExperimentOutlined className="text-purple-500" />}
            link="/laboratory"
            stats="45 Pending"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Vitals"
            description="Record and monitor patient vitals"
            icon={<HeartOutlined className="" />}
            link="/clinical/vitals"
            stats="234 Tracked"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Care Plans"
            description="Create and manage patient care plans"
            icon={<MedicineBoxOutlined className="text-cyan-500" />}
            link="/clinical/care-plans"
            stats="18 Active Plans"
            color="#06B6D4"
            bgColor="#ECFEFF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Discharge"
            description="Manage patient discharge process"
            icon={<AlertOutlined className="text-lime-500" />}
            link="/clinical/discharge"
            stats="5 Today"
            color="#84CC16"
            bgColor="#F7FEE7"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Nursing"
            description="Nursing tasks and documentation"
            icon={<TeamOutlined className="text-pink-400" />}
            link="/clinical/nursing"
            stats="42 Tasks"
            color="#F472B6"
            bgColor="#FCE7F3"
          />
        </Col>
      </Row>
    </div>
    </PageShell>
  );
}
