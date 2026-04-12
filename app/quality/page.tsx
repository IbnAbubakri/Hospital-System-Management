'use client';

import React from 'react';
import { Card, Row, Col, Typography, Progress, Alert } from 'antd';
import { SafetyCertificateOutlined, AlertOutlined, AuditOutlined, FileProtectOutlined, RiseOutlined, CustomerServiceOutlined, StopOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/design-system';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Text } = Typography;

export default function QualityPage() {
  const { hasPermission } = useAuth();

  if (!hasPermission('quality:view')) {
    return (
      <div className="bg-gray-50 min-h-full ">
        <Alert
          title="Access Denied"
          description="You don't have permission to access Quality & Compliance. Please contact your administrator."
          type="error"
          showIcon
          icon={<StopOutlined />}
          className="-xl"
        />
      </div>
    );
  }

  const qualityMetrics = {
    patientSatisfaction: 94,
    incidentRate: 1.2,
    auditCompletion: 87,
    complianceScore: 96,
  };

  const router = useRouter();

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
      className="-xl"
      styles={{ body: { padding: 20 } }}
    >
      <div className=" items-start ">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: bgColor,
            display: '',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          {icon}
        </div>
        <div className="-1">
          <Text strong className="text-base block ">{title}</Text>
          <Text type="secondary" className="">{description}</Text>
          {stats && (
            <div className="">
              <Text className="" style={{ color }}>{stats}</Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <PageShell title="Quality & Compliance">
      <div className="bg-gray-50 min-h-full">
      <PageHeader
        title="Quality & Compliance"
        badge="Risk Management"
        stats={[
          { title: 'Patient Satisfaction', value: `${qualityMetrics.patientSatisfaction}%`, change: '+2.3%', icon: <RiseOutlined />, color: '#10B981', bgColor: '#ECFDF5' },
          { title: 'Incident Rate', value: `${qualityMetrics.incidentRate}%`, change: '-0.4%', icon: <AlertOutlined />, color: '#3B82F6', bgColor: '#EFF6FF' },
          { title: 'Audit Completion', value: `${qualityMetrics.auditCompletion}%`, change: '+5.1%', icon: <AuditOutlined />, color: '#F59E0B', bgColor: '#FFFBEB' },
          { title: 'Compliance Score', value: `${qualityMetrics.complianceScore}%`, change: '+1.2%', icon: <SafetyCertificateOutlined />, color: '#8B5CF6', bgColor: '#F5F3FF' },
        ]}
      />

      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <Progress type="circle" percent={qualityMetrics.patientSatisfaction} size={80} strokeColor="#10B981" />
            <Text style={{ display: 'block', marginTop: 12, fontSize: 13 }}>Patient Satisfaction</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <Progress type="circle" percent={qualityMetrics.auditCompletion} size={80} strokeColor="#F59E0B" />
            <Text style={{ display: 'block', marginTop: 12, fontSize: 13 }}>Audit Completion</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <Progress type="circle" percent={qualityMetrics.complianceScore} size={80} strokeColor="#8B5CF6" />
            <Text style={{ display: 'block', marginTop: 12, fontSize: 13 }}>Compliance Score</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: 28, fontWeight: 600, color: '#EF4444' }}>{qualityMetrics.incidentRate}%</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>Incident Rate</Text>
            <Text type="success" style={{ block, fontSize: 11, marginTop: 4 }}>↓ 0.4% from last month</Text>
          </Card>
        </Col>
      </Row>

      <Text strong className="text-base block ">Quality Modules</Text>
      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Incident Reporting"
            description="Track and manage patient safety incidents and adverse events"
            icon={<AlertOutlined style={{ color: '#EF4444' }} />}
            link="/quality/incidents"
            stats="12 Open Cases"
            color="#EF4444"
            bgColor="#FEF2F2"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Audits"
            description="Schedule and conduct internal and external quality audits"
            icon={<AuditOutlined style={{ color: '#F59E0B' }} />}
            link="/quality/audits"
            stats="8 Pending Reviews"
            color="#F59E0B"
            bgColor="#FFFBEB"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Complaints"
            description="Manage patient and visitor complaints and feedback"
            icon={<CustomerServiceOutlined className="" />}
            link="/quality/complaints"
            stats="5 Pending Resolution"
            color="#3B82F6"
            bgColor="#EFF6FF"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Improvements"
            description="Track quality improvement initiatives and action plans"
            icon={<RiseOutlined style={{ color: '#10B981' }} />}
            link="/quality/improvements"
            stats="15 Active Projects"
            color="#10B981"
            bgColor="#ECFDF5"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Accreditation"
            description="Manage accreditation standards and certification tracking"
            icon={<SafetyCertificateOutlined style={{ color: '#8B5CF6' }} />}
            link="/quality/accreditation"
            stats="3 Active Certifications"
            color="#8B5CF6"
            bgColor="#F5F3FF"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <ModuleCard
            title="Policies & Procedures"
            description="Document control and policy management system"
            icon={<FileProtectOutlined style={{ color: '#6B7280' }} />}
            link="/legal/policies"
            stats="24 Policies Active"
            color="#6B7280"
            bgColor="#F3F4F6"
          />
        </Col>
      </Row>
    </div>
    </PageShell>
  );
}
