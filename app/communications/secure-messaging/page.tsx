'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Input, Space, Badge, Avatar, Modal } from 'antd';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SecureMessagingPage() {
  const [selectedConversation, setSelectedConversation] = React.useState<any>(null);
  const [messageText, setMessageText] = React.useState('');

  const conversations = [
    {
      id: 1,
      participant: 'Dr. Okonkwo',
      role: 'Cardiologist',
      department: 'Cardiology',
      lastMessage: 'Patient responded well to treatment',
      timestamp: '2024-02-05 14:25',
      unreadCount: 2,
      status: 'online',
    },
    {
      id: 2,
      participant: 'Nurse Chioma',
      role: 'Nurse',
      department: 'Ward 3',
      lastMessage: 'Vitals stable overnight',
      timestamp: '2024-02-05 12:30',
      unreadCount: 0,
      status: 'offline',
    },
    {
      id: 3,
      participant: 'Dr. Eze',
      role: 'General Physician',
      department: 'General Medicine',
      lastMessage: 'Please review the lab results',
      timestamp: '2024-02-05 10:15',
      unreadCount: 5,
      status: 'online',
    },
    {
      id: 4,
      participant: 'Pharmacy Department',
      role: 'Department',
      department: 'Pharmacy',
      lastMessage: 'Medication ready for pickup',
      timestamp: '2024-02-04 16:45',
      unreadCount: 0,
      status: 'offline',
    },
  ];

  const messages = {
    1: [
      { id: 1, sender: 'me', message: 'How is the patient doing?', timestamp: '2024-02-05 14:20' },
      { id: 2, sender: 'other', message: 'Patient responded well to the Amlodipine. BP is now 130/85.', timestamp: '2024-02-05 14:22' },
      { id: 3, sender: 'me', message: 'Excellent! Should we continue the current dosage?', timestamp: '2024-02-05 14:23' },
      { id: 4, sender: 'other', message: 'Yes, continue for now. Will review in 2 weeks.', timestamp: '2024-02-05 14:25' },
    ],
    2: [
      { id: 1, sender: 'other', message: 'Patient vitals have been stable overnight. Temp: 37.0, BP: 125/82, HR: 78.', timestamp: '2024-02-05 08:30' },
      { id: 2, sender: 'me', message: 'Thank you for the update. Continue monitoring.', timestamp: '2024-02-05 09:15' },
      { id: 3, sender: 'other', message: 'Vitals stable overnight', timestamp: '2024-02-05 12:30' },
    ],
    3: [
      { id: 1, sender: 'other', message: 'Please review the lab results for patient in Ward 3. CBC shows slight anemia.', timestamp: '2024-02-05 10:00' },
      { id: 2, sender: 'other', message: 'Also, liver enzymes are slightly elevated.', timestamp: '2024-02-05 10:10' },
      { id: 3, sender: 'other', message: 'Please review the lab results', timestamp: '2024-02-05 10:15' },
    ],
    4: [
      { id: 1, sender: 'other', message: 'Medication for patient Ngozi Eze is ready for pickup.', timestamp: '2024-02-04 16:30' },
      { id: 2, sender: 'me', message: 'On my way to collect it.', timestamp: '2024-02-04 16:40' },
      { id: 3, sender: 'other', message: 'Medication ready for pickup', timestamp: '2024-02-04 16:45' },
    ],
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    setMessageText('');
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Secure Messaging</Title>

      <div style={{ display: 'flex', gap: '24px', height: '600px' }}>
        <Card title="Conversations" style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
          <Input.Search
            placeholder="Search conversations..."
            allowClear
            style={{ marginBottom: '16px' }}
          />
          <List
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedConversation(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedConversation?.id === item.id ? '#e6f7ff' : 'transparent',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={item.status === 'online'} offset={[-5, 5]}>
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {item.participant.charAt(0)}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.participant}</span>
                      {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
                    </div>
                  }
                  description={
                    <div>
                      <div className="text-sm text-gray-500">{item.role} • {item.department}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.lastMessage}</div>
                      <div className="text-xs text-gray-400">{item.timestamp}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title={selectedConversation ? `Chat with ${selectedConversation.participant}` : 'Select a conversation'}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {selectedConversation ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                {(messages[selectedConversation.id as keyof typeof messages] || []).map((msg: any) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor: msg.sender === 'me' ? '#1890ff' : '#fff',
                        color: msg.sender === 'me' ? '#fff' : '#000',
                      }}
                    >
                      <div style={{ fontSize: '14px' }}>{msg.message}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '16px' }}>
                <Space.Compact style={{ width: '100%' }}>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    onPressEnter={handleSendMessage}
                  />
                  <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                    Send
                  </Button>
                </Space.Compact>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageOutlined style={{ fontSize: '48px' }} />
                <p className="mt-4">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
