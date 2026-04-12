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
    <div className="  sm: sm: lg: lg: max-w-[1400px] mx-auto">
      <Title level={3}>Messages</Title>

      <div className="  h-[600px]">
        <Card title="Inbox" className="w-[400px]  -col">
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedMessage(item)}
                className="cursor-pointer  -lg"
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!item.read} offset={[-5, 5]}>
                      <Avatar className="bg-blue-500">
                        {item.from.charAt(0)}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div className="  ">
                      <span className={!item.read ? 'font-semibold' : ''}>{item.from}</span>
                      {!item.read && <Tag color="blue">New</Tag>}
                    </div>
                  }
                  description={
                    <div>
                      <div className="font-medium ">{item.subject}</div>
                      <div className=" ">{item.date}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title={selectedMessage ? `Message from ${selectedMessage.from}` : 'Select a message'}
          className="-1  -col"
        >
          {selectedMessage ? (
            <div className=" -col h-full">
              <div className="-1 overflow-y-auto">
                <div className="">
                  <div className="  items-start ">
                    <div>
                      <Title level={5}>{selectedMessage.subject}</Title>
                      <Space>
                        <Tag color="blue">{selectedMessage.fromRole}</Tag>
                        <span className=" ">{selectedMessage.department}</span>
                      </Space>
                    </div>
                    <span className=" ">{selectedMessage.date}</span>
                  </div>
                  <div className=" bg-gray-50 " style={{ lineHeight: '1.6' }}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="border-t ">
                <Title level={5}>Reply</Title>
                <Space.Compact className="w-full">
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
                    className="h-auto"
                  >
                    Send
                  </Button>
                </Space.Compact>
                <div className="">
                  <Button size="small" icon={<PaperClipOutlined />}>Attach File</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="   h-full ">
              <MessageOutlined className="text-5xl " />
              <p>Select a message to view</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
