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
    <div className="  sm: sm: lg: lg: max-w-7xl mx-auto">
      <Title level={3}>Secure Messaging</Title>

      <div className="  h-[600px]">
        <Card title="Conversations" className="  -col">
          <Input.Search
            placeholder="Search conversations..."
            allowClear
            className=""
          />
          <List
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                onClick={() => setSelectedConversation(item)}
                className={`cursor-pointer  -lg  ${selectedConversation?.id === item.id ? 'bg-blue-50' : 'bg-transparent'}`}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={item.status === 'online'} offset={[-5, 5]}>
                      <Avatar className="bg-blue-600">
                        {item.participant.charAt(0)}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div className="  ">
                      <span className="font-medium">{item.participant}</span>
                      {item.unreadCount > 0 && <Badge count={item.unreadCount} />}
                    </div>
                  }
                  description={
                    <div>
                      <div className=" ">{item.role} • {item.department}</div>
                      <div className="  ">{item.lastMessage}</div>
                      <div className=" ">{item.timestamp}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card
          title={selectedConversation ? `Chat with ${selectedConversation.participant}` : 'Select a conversation'}
          className="-1  -col"
        >
          {selectedConversation ? (
            <div className="-1  -col">
              <div className="-1 overflow-auto  bg-gray-100 -lg">
                {(messages[selectedConversation.id as keyof typeof messages] || []).map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`  ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%]   -xl ${msg.sender === 'me' ? 'bg-blue-600 ' : 'bg-white '}`}
                    >
                      <div className="">{msg.message}</div>
                      <div className=" opacity-70 ">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200  ">
                <Space.Compact className="w-full">
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
            <div className="   h-full ">
              <div className="text-center">
                <MessageOutlined className="text-5xl" />
                <p className="">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
