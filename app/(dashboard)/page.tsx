'use client';

import React from 'react';
import { Row, Col, Card, Typography, Table, Progress, Avatar } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  AlertOutlined,
  BellOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '@/lib/contexts/AuthContext';

const { Title, Text } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#26B899'];

const patientVisitsData = [
  { name: 'Jan', visits: 1200 },
  { name: 'Feb', visits: 1350 },
  { name: 'Mar', visits: 1100 },
  { name: 'Apr', visits: 1450 },
  { name: 'May', visits: 1380 },
  { name: 'Jun', visits: 1520 },
];

const departmentData = [
  { name: 'Cardiology', value: 25 },
  { name: 'General Medicine', value: 18 },
  { name: 'Pediatrics', value: 20 },
  { name: 'Orthopedics', value: 15 },
  { name: 'Neurology', value: 12 },
  { name: 'Others', value: 10 },
];

const doctorAppointments = [
  { id: 1, patient: 'Chukwuemeka Okonkwo', time: '09:00 AM', status: 'completed', type: 'Follow-up' },
  { id: 2, patient: 'Adanna Okafor', time: '10:30 AM', status: 'in-progress', type: 'Consultation' },
  { id: 3, patient: 'Olufemi Adebayo', time: '02:00 PM', status: 'pending', type: 'New Patient' },
  { id: 4, patient: 'Chioma Eze', time: '03:30 PM', status: 'pending', type: 'Checkup' },
];

const nurseTasks = [
  { id: 1, patient: 'Chukwuemeka Okonkwo', task: 'Vital Signs Check', time: '09:00 AM', priority: 'normal' },
  { id: 2, patient: 'Adanna Okafor', task: 'Medication Admin', time: '10:00 AM', priority: 'urgent' },
  { id: 3, patient: 'Olufemi Adebayo', task: 'Lab Sample Collection', time: '11:30 AM', priority: 'normal' },
  { id: 4, patient: 'Triage Patient', task: 'New Patient Assessment', time: '02:00 PM', priority: 'high' },
];

const upcomingAppointments = [
  { id: 1, patient: 'Chukwuemeka Okonkwo', doctor: 'Dr. Ngozi Adeleke', time: '09:00 AM', department: 'Cardiology' },
  { id: 2, patient: 'Adanna Okafor', doctor: 'Dr. Emeka Okoro', time: '10:30 AM', department: 'General Medicine' },
  { id: 3, patient: 'Olufemi Adebayo', doctor: 'Dr. Ngozi Adeleke', time: '11:00 AM', department: 'Cardiology' },
  { id: 4, patient: 'Ibrahim Musah', doctor: 'Dr. Emeka Okoro', time: '02:00 PM', department: 'General Medicine' },
];

const appointmentColumns = [
  {
    title: 'Patient',
    dataIndex: 'patient',
    key: 'patient',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <Avatar size="small" className="bg-[#0088FE]" icon={<UserOutlined />} />
        <span className="font-medium">{text}</span>
      </div>
    ),
  },
  { title: 'Time', dataIndex: 'time', key: 'time', width: 100 },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (status: string) => {
      const config: Record<string, { color: string; bg: string }> = {
        completed: { color: '#52C41A', bg: '#F6FFED' },
        'in-progress': { color: '#1890FF', bg: '#E6F7FF' },
        pending: { color: '#FAAD14', bg: '#FFFBE6' },
      };
      const c = config[status] || config.pending;
      return (
        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: c.bg, color: c.color }}>
          {status.toUpperCase().replace(' ', '-')}
        </span>
      );
    },
  },
];

const taskColumns = [
  {
    title: 'Task',
    dataIndex: 'task',
    key: 'task',
    render: (text: string, record: any) => (
      <div>
        <div className="font-medium">{text}</div>
        <Text type="secondary" className="text-sm">{record.patient}</Text>
      </div>
    ),
  },
  { title: 'Time', dataIndex: 'time', key: 'time', width: 100 },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 90,
    render: (p: string) => {
      const c: Record<string, { color: string; bg: string }> = {
        urgent: { color: '#FF4D4F', bg: '#FFF1F0' },
        high: { color: '#FA8C16', bg: '#FFF7E6' },
        normal: { color: '#52C41A', bg: '#F6FFED' },
      };
      const config = c[p] || c.normal;
      return <span className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: config.bg, color: config.color }}>{p.toUpperCase()}</span>;
    },
  },
];

const upcomingColumns = [
  { title: 'Patient', dataIndex: 'patient', key: 'patient' },
  { title: 'Doctor', dataIndex: 'doctor', key: 'doctor' },
  { title: 'Time', dataIndex: 'time', key: 'time' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role;
  const isAdmin = role === 'Administrator';
  const isDoctor = role === 'Doctor';
  const isNurse = role === 'AuxiliaryNurse';

  const adminStats = [
    { title: 'Total Patients', value: '1,250', change: '+12%', icon: <UserOutlined />, color: '#0088FE', bgColor: '#E6F7FF' },
    { title: "Today's Appointments", value: '45', change: '+8%', icon: <CalendarOutlined />, color: '#00C49F', bgColor: '#E6FFED' },
    { title: 'Monthly Revenue', value: 'N85M', change: '+15%', icon: <DollarOutlined />, color: '#FFBB28', bgColor: '#FFFBE6' },
    { title: 'Admitted', value: '68', change: '-3%', icon: <MedicineBoxOutlined />, color: '#FF8042', bgColor: '#FFF1E6' },
  ];

  const doctorStats = [
    { title: 'My Patients', value: '12', change: '+2', icon: <UserOutlined />, color: '#0088FE', bgColor: '#E6F7FF' },
    { title: 'Appointments Today', value: '4', change: '+1', icon: <CalendarOutlined />, color: '#00C49F', bgColor: '#E6FFED' },
    { title: 'Pending EMRs', value: '3', change: '-1', icon: <FileTextOutlined />, color: '#FF8042', bgColor: '#FFF1E6' },
    { title: 'Lab Results', value: '7', change: '+2', icon: <AlertOutlined />, color: '#FFBB28', bgColor: '#FFFBE6' },
  ];

  const nurseStats = [
    { title: 'Triage Today', value: '24', change: '+5', icon: <AlertOutlined />, color: '#FF4D4F', bgColor: '#FFF1F0' },
    { title: 'Pending Tasks', value: '8', change: '+2', icon: <ClockCircleOutlined />, color: '#FF8042', bgColor: '#FFF1E6' },
    { title: 'Available Doctors', value: '5', change: '0', icon: <TeamOutlined />, color: '#00C49F', bgColor: '#E6FFED' },
    { title: 'Admitted Patients', value: '68', change: '-2', icon: <MedicineBoxOutlined />, color: '#0088FE', bgColor: '#E6F7FF' },
  ];

  const stats = isAdmin ? adminStats : isDoctor ? doctorStats : nurseStats;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={3} className="!m-0">
          Welcome back, Engr Faaruq
          <Text type="secondary" className="ml-2">(Head ADMINISTRATOR)</Text>
        </Title>
        <Text type="secondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary" className="text-sm">{stat.title}</Text>
                  <Title level={2} className="!m-0 !mb-1">{stat.value}</Title>
                  <Text type="secondary" className="text-sm">vs last month: {stat.change}</Text>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: stat.bgColor }}>
                  <span className="text-xl" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Admin Dashboard */}
      {isAdmin && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card title="Patient Visits Trend" className="border-0 shadow-lg rounded-xl">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={patientVisitsData}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8C8C8C', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                    <Area type="monotone" dataKey="visits" stroke="#0088FE" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Department Distribution" className="border-0 shadow-lg h-full rounded-xl">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={departmentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {departmentData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card title="Upcoming Appointments" extra={<a href="/patients/appointments" className="text-blue-500">View All</a>} className="border-0 shadow-lg rounded-xl">
                <Table dataSource={upcomingAppointments} columns={upcomingColumns} rowKey="id" pagination={false} size="small" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Hospital Overview" className="border-0 shadow-lg rounded-xl">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1"><Text>Bed Occupancy</Text><Text>78%</Text></div>
                    <Progress percent={78} showInfo={false} strokeColor="#52C41A" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><Text>Emergency</Text><Text>92%</Text></div>
                    <Progress percent={92} showInfo={false} strokeColor="#FF4D4F" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><Text>ICU</Text><Text>85%</Text></div>
                    <Progress percent={85} showInfo={false} strokeColor="#FA8C16" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><Text>General Ward</Text><Text>65%</Text></div>
                    <Progress percent={65} showInfo={false} strokeColor="#1890FF" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Doctor Dashboard */}
      {isDoctor && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card title="My Appointments Today" extra={<a href="/patients/appointments" className="text-blue-500">View All</a>} className="border-0 shadow-lg rounded-xl">
                <Table dataSource={doctorAppointments} columns={appointmentColumns} rowKey="id" pagination={false} size="small" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Notifications" extra={<BellOutlined />} className="border-0 shadow-lg rounded-xl">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CalendarOutlined className="text-blue-500" />
                    <div>
                      <Text className="font-medium">New appointment scheduled</Text>
                      <Text type="secondary" className="block text-sm">Adanna Okafor - 10:30 AM</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertOutlined className="text-orange-500" />
                    <div>
                      <Text className="font-medium">Lab results ready</Text>
                      <Text type="secondary" className="block text-sm">Chukwuemeka Okonkwo - Blood Test</Text>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <FileTextOutlined className="text-green-500" />
                    <div>
                      <Text className="font-medium">EMR review needed</Text>
                      <Text type="secondary" className="block text-sm">Olufemi Adebayo - Follow-up</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="Patient Visits This Week" className="border-0 shadow-lg rounded-xl">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={patientVisitsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="visits" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Your Department Stats" className="border-0 shadow-lg rounded-xl">
                <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><Text>Patients Seen This Week</Text><Text strong>32</Text></div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><Text>Average Consultation Time</Text><Text strong>15 mins</Text></div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><Text>Pending Follow-ups</Text><Text strong>5</Text></div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><Text>Prescriptions Written</Text><Text strong>28</Text></div>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Nurse Dashboard */}
      {isNurse && (
        <>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={16}>
              <Card title="Today's Tasks" className="border-0 shadow-lg rounded-xl">
                <Table dataSource={nurseTasks} columns={taskColumns} rowKey="id" pagination={false} size="small" />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Quick Actions" className="border-0 shadow-lg rounded-xl">
                <div className="space-y-2">
                  <a href="/triage" className="block p-3 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-medium text-center">Start Triage</a>
                  <a href="/patients/appointments" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium text-center">Schedule Appointment</a>
                  <a href="/patients" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 font-medium text-center">View Patients</a>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="Triage Statistics" className="border-0 shadow-lg rounded-xl">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[{ name: 'Mon', v: 8 }, { name: 'Tue', v: 12 }, { name: 'Wed', v: 6 }, { name: 'Thu', v: 10 }, { name: 'Fri', v: 9 }]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="v" fill="#FF4D4F" radius={[4, 4, 0, 0]} name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Available Doctors Today" className="border-0 shadow-lg rounded-xl">
                <div className="space-y-3">
                  {[
                    { name: 'Dr. Ngozi Adeleke', dept: 'Cardiology', slots: '6 slots' },
                    { name: 'Dr. Emeka Okoro', dept: 'General Medicine', slots: '8 slots' },
                    { name: 'Dr. Tunde Bakare', dept: 'Orthopedics', slots: '5 slots' },
                    { name: 'Dr. Aisha Yusuf', dept: 'Pediatrics', slots: '8 slots' },
                  ].map((doc, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
<Avatar size="small" className="bg-[#0088FE]" icon={<UserOutlined />} />
                        <div>
                          <Text className="font-medium">{doc.name}</Text>
                          <Text type="secondary" className="block text-sm">{doc.dept}</Text>
                        </div>
                      </div>
                      <Text type="secondary" className="text-sm">{doc.slots}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
