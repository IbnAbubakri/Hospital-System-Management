'use client';

import React from 'react';
import { Card, Typography, Form, Input, Button, Select, InputNumber, Radio, Space, App } from 'antd';
import { CreditCardOutlined, BankOutlined, MobileOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function PaymentOnlinePage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [paymentMethod, setPaymentMethod] = React.useState('card');

  const invoices = [
    { id: 'INV-2024-0892', date: '2024-02-01', description: 'Hospital Services - Admit Ward 3', amount: 45000 },
    { id: 'INV-2024-0891', date: '2024-01-28', description: 'Laboratory Tests', amount: 12500 },
    { id: 'INV-2024-0890', date: '2024-01-25', description: 'Consultation Fees', amount: 10000 },
  ];

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  const handlePayment = () => {
    form.validateFields().then((values) => {
      message.success('Payment processed successfully');
    });
  };

  return (
    <div className="  sm: sm: lg: lg: max-w-[1200px] mx-auto">
      <Title level={3}>Online Payment</Title>

      <div className="  -row -wrap">
        <Card title="Select Invoices to Pay" className="-1 min-w-[300px]">
          <Space direction="vertical" className="w-full" size="middle">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="    border ">
                <div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className=" ">{invoice.description}</div>
                  <div className=" ">{invoice.date}</div>
                </div>
                <div className="  ">
                  <span className="font-semibold">₦{invoice.amount.toLocaleString()}</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            ))}
            <div className="    border-t">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold ">₦{totalAmount.toLocaleString()}</span>
            </div>
          </Space>
        </Card>

        <Card title="Payment Details" className="-1 min-w-[350px]">
          <Form form={form} layout="vertical">
            <Form.Item label="Payment Method">
              <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Radio.Button value="card"><CreditCardOutlined /> Card</Radio.Button>
                <Radio.Button value="bank"><BankOutlined /> Bank Transfer</Radio.Button>
                <Radio.Button value="ussd"><MobileOutlined /> USSD</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {paymentMethod === 'card' && (
              <>
                <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true }]}>
                  <Input placeholder="1234 5678 9012 3456" maxLength={19} />
                </Form.Item>
                <div className=" ">
                  <Form.Item name="expiry" label="Expiry Date" rules={[{ required: true }]}>
                    <Input placeholder="MM/YY" maxLength={5} />
                  </Form.Item>
                  <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
                    <Input placeholder="123" maxLength={3} type="password" />
                  </Form.Item>
                </div>
                <Form.Item name="cardName" label="Cardholder Name" rules={[{ required: true }]}>
                  <Input placeholder="Name on card" />
                </Form.Item>
              </>
            )}

            {paymentMethod === 'bank' && (
              <>
                <Form.Item name="bank" label="Select Bank" rules={[{ required: true }]}>
                  <Select placeholder="Select your bank">
                    <Select.Option value="gtbank">Guaranty Trust Bank</Select.Option>
                    <Select.Option value="firstbank">First Bank of Nigeria</Select.Option>
                    <Select.Option value="access">Access Bank</Select.Option>
                    <Select.Option value="zenith">Zenith Bank</Select.Option>
                    <Select.Option value="uba">United Bank for Africa</Select.Option>
                  </Select>
                </Form.Item>
                <div className=" bg-gray-50 ">
                  <p className="font-medium ">Bank Transfer Details:</p>
                  <p>Account Name: Hospital Management Ltd</p>
                  <p>Account Number: 1234567890</p>
                  <p>Bank: GTBank</p>
                </div>
              </>
            )}

            {paymentMethod === 'ussd' && (
              <>
                <Form.Item name="bank" label="Select Bank" rules={[{ required: true }]}>
                  <Select placeholder="Select your bank">
                    <Select.Option value="gtbank">Guaranty Trust Bank</Select.Option>
                    <Select.Option value="firstbank">First Bank of Nigeria</Select.Option>
                    <Select.Option value="access">Access Bank</Select.Option>
                    <Select.Option value="zenith">Zenith Bank</Select.Option>
                  </Select>
                </Form.Item>
                <div className=" bg-gray-50 ">
                  <p className="font-medium ">Dial the USSD code below:</p>
                  <p className="text-xl font-bold ">*737*{totalAmount}*1234567890#</p>
                  <p className="  ">Follow the prompts to complete payment</p>
                </div>
              </>
            )}

            <Form.Item name="email" label="Email for Receipt" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="your@email.com" />
            </Form.Item>

            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input placeholder="+234 801 234 5678" />
            </Form.Item>

            <Button type="primary" block size="large" onClick={handlePayment}>
              Pay ₦{totalAmount.toLocaleString()}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
}
