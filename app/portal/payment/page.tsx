'use client';

import React from 'react';
import { Button, Card, List, Badge, Tag, Typography, Progress, Statistic, Row, Col, Radio, Space, Checkbox } from 'antd';
import { CreditCardOutlined, BankOutlined, WalletOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function PaymentPage() {
  const router = useRouter();

  const mockBills = [
    { id: 'bill1', billNumber: 'INV-2024-001', date: '2024-02-01', amount: 45000, status: 'pending', description: 'Consultation & Lab Tests' },
    { id: 'bill2', billNumber: 'INV-2024-002', date: '2024-01-25', amount: 125000, status: 'pending', description: 'Admission Charges (3 days)' },
    { id: 'bill3', billNumber: 'INV-2024-003', date: '2024-01-15', amount: 28000, status: 'paid', description: 'Pharmacy & Medicines' },
  ];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ background: 'linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>Make Payment</Title>
          <Text type="secondary">Pay your hospital bills securely online</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
              <Statistic
                title="Outstanding Balance"
                value={198000}
                prefix="₦"
                precision={0}
                valueStyle={{ color: '#ff4d4f', fontSize: '32px' }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
          <Title level={4}>Select Bills to Pay</Title>
          <List
            dataSource={mockBills.filter(b => b.status === 'pending')}
            renderItem={(bill) => (
              <List.Item
                actions={[
                  <Checkbox key="check" />
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{bill.description}</Text>
                      <Tag color="warning">Pending</Tag>
                    </Space>
                  }
                  description={`Bill #${bill.billNumber} | ${bill.date}`}
                />
                <Text strong style={{ fontSize: '18px' }}>₦{bill.amount.toLocaleString()}</Text>
              </List.Item>
            )}
          />
        </Card>

        <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
          <Title level={4}>Payment Method</Title>
          <Radio.Group style={{ width: '100%' }} defaultValue="card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="card">
                <Space>
                  <CreditCardOutlined />
                  <Text>Credit/Debit Card</Text>
                </Space>
              </Radio>
              <Radio value="bank">
                <Space>
                  <BankOutlined />
                  <Text>Bank Transfer</Text>
                </Space>
              </Radio>
              <Radio value="wallet">
                <Space>
                  <WalletOutlined />
                  <Text>Wallet Payment</Text>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>

        <Card style={{ borderRadius: '12px' }} className="p-4 sm:p-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text type="secondary">Subtotal</Text>
              <br />
              <Text strong style={{ fontSize: '20px' }}>₦170,000</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text type="secondary">Transaction Fee</Text>
              <br />
              <Text strong style={{ fontSize: '20px' }}>₦1,500</Text>
            </Col>
          </Row>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Text type="secondary">Total</Text>
            <br />
            <Text strong style={{ fontSize: '28px', color: '#ff4d4f' }}>₦171,500</Text>
          </div>
          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: '24px', height: '48px', fontSize: '18px' }}
            icon={<ArrowRightOutlined />}
          >
            Proceed to Payment
          </Button>
        </Card>
      </div>
    </div>
  );
}
