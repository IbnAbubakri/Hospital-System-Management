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
    <div className="min-h-screen   sm: sm: lg: lg: bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="max-w-[1000px] mx-auto">
        <div className="">
          <Title level={2}>Make Payment</Title>
          <Text type="secondary">Pay your hospital bills securely online</Text>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className=" -xl">
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

        <Card className=" -xl">
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
                <Text strong className="">₦{bill.amount.toLocaleString()}</Text>
              </List.Item>
            )}
          />
        </Card>

        <Card className=" -xl">
          <Title level={4}>Payment Method</Title>
          <Radio.Group className="w-full" defaultValue="card">
            <Space direction="vertical" className="w-full">
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

        <Card className="-xl">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Text type="secondary">Subtotal</Text>
              <br />
              <Text strong className="text-xl">₦170,000</Text>
            </Col>
            <Col xs={24} sm={12}>
              <Text type="secondary">Transaction Fee</Text>
              <br />
              <Text strong className="text-xl">₦1,500</Text>
            </Col>
          </Row>
          <div className="  border-t">
            <Text type="secondary">Total</Text>
            <br />
            <Text strong className="text-2xl ">₦171,500</Text>
          </div>
          <Button
            type="primary"
            size="large"
            block
            className="  "
            icon={<ArrowRightOutlined />}
          >
            Proceed to Payment
          </Button>
        </Card>
      </div>
    </div>
  );
}
