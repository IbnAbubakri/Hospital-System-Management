'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Input, Space, Badge, Avatar } from 'antd';
import { MessageOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);
  const [replyText, setReplyText] = React.useState('');

  const messages = [
    {
      id: 1,
      from: 'Dr. Okonkwo',
      fromRole: 'Doctor',
      subject: 'Follow-up Appointment Reminder',
      message: 'Dear Patient, this is a reminder about your follow-up appointment scheduled for February 10, 2024 at 10:00 AM. Please ensure to bring your current medications.',
      date: '2024-02-05 09:30',
      read: false,
      department: 'Cardiology',
    },
    {
      id: 2,
      from: 'Nurse Chioma',
      fromRole: 'Nurse',
      subject: 'Lab Results Available',
      message: 'Your recent lab results are now available. Please log in to the patient portal to view them. If you have any questions, please contact us.',
      date: '2024-02-04 14:20',
      read: true,
      department: 'General',
    },
    {
      id: 3,
      from: 'Billing Department',
      fromRole: 'Admin',
      subject: 'Payment Confirmation',
      message: 'This is to confirm that your payment of ₦45,000 for Invoice INV-2024-0892 has been received. Thank you for your prompt payment.',
      date: '2024-02-03 16:45',
      read: true,
      department: 'Billing',
    },
    {
      id: 4,
      from: 'Dr. Eze',
      fromRole: 'Doctor',
      subject: 'Test Results Review',
      message: 'I have reviewed your recent test results. Everything looks good. Continue with your current medication regimen. We will schedule a follow-up in 2 weeks.',
      date: '2024-02-02 11:15',
      read: true,
      department: 'General Medicine',
    },
    {
      id: 5,
      from: 'Pharmacy Department',
      fromRole: 'Pharmacy',
      subject: 'Medication Ready for Pickup',
      message: 'Your prescribed medication is ready for pickup at the pharmacy. Please bring your prescription receipt when collecting.',
      date: '2024-02-01 10:00',
      read: true,
      department: 'Pharmacy',
    },
  ];

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    setReplyText('');
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Messages</Title>

      <div style={{ display: 'flex', gap: '24px', height: '600px' }}>
        <Card title="Inbox" style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedMessage(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedMessage?.id === item.id ? '#f0f7ff' : 'transparent',
                  padding: '12px',
                  borderRadius: '8px',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read} offset={[-5, 5]}>
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {item.from.charAt(0)}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span className={!item.read ? 'font-semibold' : ''}>{item.from}</span>
                      {!item.read && <Tag color="blue">New</Tag>}
                    </div>
                  }
                  description={
                    <div>
                      <div className="font-medium text-sm">{item.subject}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title={selectedMessage ? `Message from ${selectedMessage.from}` : 'Select a message'}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {selectedMessage ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Title level={5}>{selectedMessage.subject}</Title>
                      <Space>
                        <Tag color="blue">{selectedMessage.fromRole}</Tag>
                        <span className="text-sm text-gray-500">{selectedMessage.department}</span>
                      </Space>
                    </div>
                    <span className="text-sm text-gray-500">{selectedMessage.date}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded" style={{ lineHeight: '1.6' }}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                <Title level={5}>Reply</Title>
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your message here..."
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    style={{ height: 'auto' }}
                  >
                    Send
                  </Button>
                </Space.Compact>
                <div style={{ marginTop: '8px' }}>
                  <Button size="small" icon={<PaperClipOutlined />}>Attach File</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <MessageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <p>Select a message to view</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
