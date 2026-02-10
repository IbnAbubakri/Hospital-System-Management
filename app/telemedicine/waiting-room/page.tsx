'use client';

import React from 'react';
import { Card, Typography, List, Avatar, Tag, Badge, Space, Button, Progress } from 'antd';
import { VideoCameraOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function WaitingRoomPage() {
  const appointments = [
    {
      id: 1,
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      doctor: 'Dr. Okonkwo',
      scheduledTime: '14:30',
      waitTime: 5,
      status: 'ready',
      reason: 'Follow-up consultation',
      joinUrl: '/telemedicine/video/1',
    },
    {
      id: 2,
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      doctor: 'Dr. Eze',
      scheduledTime: '14:45',
      waitTime: 20,
      status: 'waiting',
      reason: 'Medication review',
      joinUrl: '/telemedicine/video/2',
    },
    {
      id: 3,
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      doctor: 'Dr. Nnamdi',
      scheduledTime: '15:00',
      waitTime: 35,
      status: 'waiting',
      reason: 'Post-op check',
      joinUrl: '/telemedicine/video/3',
    },
    {
      id: 4,
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      doctor: 'Dr. Okafor',
      scheduledTime: '15:15',
      waitTime: 50,
      status: 'waiting',
      reason: 'Lab results review',
      joinUrl: '/telemedicine/video/4',
    },
  ];

  const inProgress = [
    {
      id: 5,
      patient: 'Emeka Okafor',
      mrn: 'MRN-2024-0002',
      doctor: 'Dr. Okonkwo',
      startTime: '14:00',
      duration: 18,
      status: 'active',
    },
  ];

  const completed = [
    {
      id: 6,
      patient: 'Fatima Ahmed',
      mrn: 'MRN-2024-0004',
      doctor: 'Dr. Eze',
      scheduledTime: '13:30',
      completedTime: '13:52',
      duration: 22,
      status: 'completed',
    },
    {
      id: 7,
      patient: 'Ibrahim Yusuf',
      mrn: 'MRN-2024-0006',
      doctor: 'Dr. Nnamdi',
      scheduledTime: '13:00',
      completedTime: '13:18',
      duration: 18,
      status: 'completed',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Title level={3}>Telemedicine Waiting Room</Title>
        <Space size="large">
          <Badge count={appointments.filter(a => a.status === 'ready').length} showZero style={{ backgroundColor: '#52c41a' }}>
            <span className="text-gray-600">Ready to Join</span>
          </Badge>
          <Badge count={appointments.filter(a => a.status === 'waiting').length} showZero>
            <span className="text-gray-600">Waiting</span>
          </Badge>
          <Badge count={inProgress.length} showZero style={{ backgroundColor: '#1890ff' }}>
            <span className="text-gray-600">In Progress</span>
          </Badge>
        </Space>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <Card title={<Badge count={inProgress.length} showZero overflowCount={99}><span>Active Consultations</span></Badge>}>
          {inProgress.length > 0 ? (
            <List
              dataSource={inProgress}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<VideoCameraOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span>{item.patient}</span>
                        <Tag color="processing" icon={<ClockCircleOutlined />}>Live - {item.duration} min</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className="text-sm text-gray-500">with {item.doctor}</div>
                        <Progress percent={45} showInfo={false} size="small" />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center text-gray-400 py-8">No active consultations</div>
          )}
        </Card>

        <Card title={<Badge count={appointments.filter(a => a.status === 'ready').length} showZero overflowCount={99}><span>Ready to Join</span></Badge>}>
          {appointments.filter(a => a.status === 'ready').length > 0 ? (
            <List
              dataSource={appointments.filter(a => a.status === 'ready')}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="primary" icon={<VideoCameraOutlined />} href={item.joinUrl}>
                      Join Now
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold">{item.patient}</span>
                        <Tag color="success">Ready</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className="text-sm text-gray-500">Scheduled: {item.scheduledTime} • with {item.doctor}</div>
                        <div className="text-sm text-gray-600">{item.reason}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center text-gray-400 py-8">No patients ready</div>
          )}
        </Card>

        <Card title={<Badge count={appointments.filter(a => a.status === 'waiting').length} showZero overflowCount={99}><span>Waiting</span></Badge>}>
          {appointments.filter(a => a.status === 'waiting').length > 0 ? (
            <List
              dataSource={appointments.filter(a => a.status === 'waiting')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ClockCircleOutlined />} style={{ backgroundColor: '#faad14' }} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span>{item.patient}</span>
                        <Tag color="warning">{item.waitTime} min wait</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className="text-sm text-gray-500">Scheduled: {item.scheduledTime} • with {item.doctor}</div>
                        <div className="text-sm text-gray-600">{item.reason}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center text-gray-400 py-8">No patients waiting</div>
          )}
        </Card>

        <Card title={<Badge count={completed.length} showZero overflowCount={99}><span>Completed Today</span></Badge>}>
          {completed.length > 0 ? (
            <List
              dataSource={completed}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                    title={
                      <div className="flex justify-between items-center">
                        <span>{item.patient}</span>
                        <Tag color="success">{item.duration} min</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className="text-sm text-gray-500">Scheduled: {item.scheduledTime} • Completed: {item.completedTime}</div>
                        <div className="text-sm text-gray-600">with {item.doctor}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center text-gray-400 py-8">No completed consultations</div>
          )}
        </Card>
      </div>
    </div>
  );
}
