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
    <div className="  sm: sm: lg: lg: max-w-7xl mx-auto">
      <div className=" -col sm:-row items-start sm:   ">
        <Title level={3}>Telemedicine Waiting Room</Title>
        <Space size="large">
            <Badge count={appointments.filter(a => a.status === 'ready').length} showZero className="bg-[#52c41a]">
            <span className="">Ready to Join</span>
          </Badge>
          <Badge count={appointments.filter(a => a.status === 'waiting').length} showZero>
            <span className="">Waiting</span>
          </Badge>
            <Badge count={inProgress.length} showZero className="bg-[#1890ff]">
            <span className="">In Progress</span>
          </Badge>
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <Card title={<Badge count={inProgress.length} showZero overflowCount={99}><span>Active Consultations</span></Badge>}>
          {inProgress.length > 0 ? (
            <List
              dataSource={inProgress}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<VideoCameraOutlined />} className="bg-[#1890ff]" />}
                    title={
                      <div className="  ">
                        <span>{item.patient}</span>
                        <Tag color="processing" icon={<ClockCircleOutlined />}>Live - {item.duration} min</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className=" ">with {item.doctor}</div>
                        <Progress percent={45} showInfo={false} size="small" />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center  ">No active consultations</div>
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
                      <div className="  ">
                        <span className="color: '#059669' font-semibold">{item.patient}</span>
                        <Tag color="success">Ready</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className=" ">Scheduled: {item.scheduledTime} • with {item.doctor}</div>
                        <div className=" ">{item.reason}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center  ">No patients ready</div>
          )}
        </Card>

        <Card title={<Badge count={appointments.filter(a => a.status === 'waiting').length} showZero overflowCount={99}><span>Waiting</span></Badge>}>
          {appointments.filter(a => a.status === 'waiting').length > 0 ? (
            <List
              dataSource={appointments.filter(a => a.status === 'waiting')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ClockCircleOutlined />} className="bg-[#faad14]" />}
                    title={
                      <div className="  ">
                        <span>{item.patient}</span>
                        <Tag color="warning">{item.waitTime} min wait</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className=" ">Scheduled: {item.scheduledTime} • with {item.doctor}</div>
                        <div className=" ">{item.reason}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center  ">No patients waiting</div>
          )}
        </Card>

        <Card title={<Badge count={completed.length} showZero overflowCount={99}><span>Completed Today</span></Badge>}>
          {completed.length > 0 ? (
            <List
              dataSource={completed}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} className="bg-[#52c41a]" />}
                    title={
                      <div className="  ">
                        <span>{item.patient}</span>
                        <Tag color="success">{item.duration} min</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.mrn}</div>
                        <div className=" ">Scheduled: {item.scheduledTime} • Completed: {item.completedTime}</div>
                        <div className=" ">with {item.doctor}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center  ">No completed consultations</div>
          )}
        </Card>
      </div>
    </div>
  );
}
