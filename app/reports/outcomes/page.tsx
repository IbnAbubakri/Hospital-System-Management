'use client';

import React from 'react';
import { Card, Typography, Table, Tag, Statistic, Row, Col, Progress } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function TreatmentOutcomesPage() {
  const outcomes = [
    { procedure: 'CABG', total: 45, successful: 42, successRate: 93, avgStay: 7, department: 'Cardiology' },
    { procedure: 'Appendectomy', total: 32, successful: 30, successRate: 94, avgStay: 3, department: 'General Medicine' },
    { procedure: 'Hip Replacement', total: 18, successful: 16, successRate: 89, avgStay: 10, department: 'Orthopedics' },
    { procedure: 'Normal Delivery', total: 67, successful: 67, successRate: 100, avgStay: 2, department: 'Pediatrics' },
    { procedure: 'C-Section', total: 23, successful: 22, successRate: 96, avgStay: 4, department: 'Obstetrics' },
  ];

  const columns = [
    { title: 'Procedure', dataIndex: 'procedure', key: 'procedure' },
    { title: 'Department', dataIndex: 'department', key: 'department', render: (dept: string) => <Tag>{dept}</Tag> },
    { title: 'Total Cases', dataIndex: 'total', key: 'total' },
    { title: 'Successful', dataIndex: 'successful', key: 'successful', render: (val: number) => <span className="color: '#059669' font-semibold">{val}</span> },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <div className="">
          <Progress percent={rate} size="small" strokeColor="#10B981" />
          <Text className="">{rate}%</Text>
        </div>
      ),
    },
    { title: 'Avg Stay (Days)', dataIndex: 'avgStay', key: 'avgStay' },
  ];

  const overallSuccessRate = Math.round(
    outcomes.reduce((sum, o) => sum + o.successful, 0) /
    outcomes.reduce((sum, o) => sum + o.total, 0) * 100
  );

  return (
    <div className="  sm: sm: lg: lg: max-w-6xl mx-auto">
      <Title level={3}>Treatment Outcomes & Success Rates</Title>

      <Row gutter={[16, 16]} className="">
        <Col xs={24} sm={8}>
          <Card className=" sm:">
            <Statistic
              title="Overall Success Rate"
              value={overallSuccessRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className=" sm:">
            <Statistic
              title="Total Procedures"
              value={outcomes.reduce((sum, o) => sum + o.total, 0)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className=" sm:">
            <Statistic
              title="Avg Length of Stay"
              value={(outcomes.reduce((sum, o) => sum + o.avgStay * o.total, 0) / outcomes.reduce((sum, o) => sum + o.total, 0)).toFixed(1)}
              suffix=" days"
            />
          </Card>
        </Col>
      </Row>

      <Card className=" sm:">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={outcomes}
            rowKey="procedure"
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}
