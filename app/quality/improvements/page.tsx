'use client';

import React from 'react';
import { Card, Typography, List, Tag, Button, Progress, Space, Timeline, Modal } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function QualityImprovementsPage() {
  const [selectedProject, setSelectedProject] = React.useState<any>(null);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const projects = [
    {
      id: 1,
      title: 'Reduce Medication Errors',
      category: 'Patient Safety',
      priority: 'High',
      status: 'In Progress',
      startDate: '2024-01-15',
      targetDate: '2024-04-15',
      progress: 45,
      owner: 'Pharmacy Manager',
      team: 'Pharmacy, Nursing, Quality',
    },
    {
      id: 2,
      title: 'Improve Patient Satisfaction Scores',
      category: 'Service Quality',
      priority: 'Medium',
      status: 'In Progress',
      startDate: '2024-01-01',
      targetDate: '2024-06-30',
      progress: 30,
      owner: 'Medical Director',
      team: 'All Departments',
    },
    {
      id: 3,
      title: 'Reduce Patient Wait Times',
      category: 'Efficiency',
      priority: 'High',
      status: 'In Progress',
      startDate: '2024-02-01',
      targetDate: '2024-05-01',
      progress: 20,
      owner: 'Operations Manager',
      team: 'Front Desk, Nursing',
    },
    {
      id: 4,
      title: 'Enhance Hand Hygiene Compliance',
      category: 'Infection Control',
      priority: 'High',
      status: 'In Progress',
      startDate: '2024-01-10',
      targetDate: '2024-04-10',
      progress: 65,
      owner: 'Infection Control',
      team: 'All Clinical Staff',
    },
    {
      id: 5,
      title: 'Standardize Discharge Process',
      category: 'Process Improvement',
      priority: 'Medium',
      status: 'Planning',
      startDate: '2024-03-01',
      targetDate: '2024-06-01',
      progress: 0,
      owner: 'Nursing Director',
      team: 'Nursing, Pharmacy, Billing',
    },
    {
      id: 6,
      title: 'Implement Electronic Prescribing',
      category: 'Technology',
      priority: 'Medium',
      status: 'Completed',
      startDate: '2023-10-01',
      targetDate: '2024-01-31',
      progress: 100,
      owner: 'IT Director',
      team: 'IT, Pharmacy, Medical Staff',
    },
  ];

  const milestones = [
    { id: 1, project: 'Reduce Medication Errors', milestone: 'Implement barcode scanning', date: '2024-02-15', status: 'Completed' },
    { id: 2, project: 'Reduce Medication Errors', milestone: 'Staff training completion', date: '2024-03-01', status: 'In Progress' },
    { id: 3, project: 'Improve Patient Satisfaction', milestone: 'Launch patient feedback survey', date: '2024-02-01', status: 'Completed' },
    { id: 4, project: 'Hand Hygiene Compliance', milestone: 'Achieve 90% compliance rate', date: '2024-03-31', status: 'In Progress' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-6">
        <Title level={3}>Quality Improvement Projects</Title>
        <Button type="primary" icon={<PlusOutlined />}>New Project</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-gray-500">Active Projects</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{projects.filter(p => p.status === 'Completed').length}</div>
            <div className="text-gray-500">Completed</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{projects.filter(p => p.status === 'Planning').length}</div>
            <div className="text-gray-500">In Planning</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%</div>
            <div className="text-gray-500">Avg Progress</div>
          </div>
        </Card>
      </div>

      <Card title="Active Projects" style={{ marginBottom: '24px' }}>
        <List
          dataSource={projects}
          renderItem={(project) => (
            <List.Item
              key={project.id}
              onClick={() => {
                setSelectedProject(project);
                setIsModalVisible(true);
              }}
              style={{ cursor: 'pointer', padding: '16px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #f0f0f0' }}
            >
              <List.Item.Meta
                title={
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{project.title}</span>
                    <Tag color={project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'processing' : 'default'}>
                      {project.status}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag color="blue">{project.category}</Tag>
                      <Tag color={project.priority === 'High' ? 'error' : 'warning'}>{project.priority} Priority</Tag>
                    </div>
                    <div className="text-sm text-gray-500">
                      Owner: {project.owner} • Target: {project.targetDate}
                    </div>
                    <Progress percent={project.progress} size="small" className="mt-2" />
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Upcoming Milestones">
        <Timeline
          items={milestones.map((m) => ({
            children: (
              <div>
                <div className="font-medium">{m.milestone}</div>
                <div className="text-sm text-gray-500">{m.project}</div>
                <div className="text-sm text-gray-500">Due: {m.date}</div>
                <Tag color={m.status === 'Completed' ? 'success' : 'processing'}>{m.status}</Tag>
              </div>
            ),
          }))}
        />
      </Card>

      <Modal
        title={selectedProject?.title}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>,
        ]}
        width={700}
      >
        {selectedProject && (
          <div>
            <Card size="small" className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Category:</strong> {selectedProject.category}</div>
                <div><strong>Priority:</strong> {selectedProject.priority}</div>
                <div><strong>Status:</strong> {selectedProject.status}</div>
                <div><strong>Progress:</strong> {selectedProject.progress}%</div>
                <div><strong>Start Date:</strong> {selectedProject.startDate}</div>
                <div><strong>Target Date:</strong> {selectedProject.targetDate}</div>
                <div><strong>Owner:</strong> {selectedProject.owner}</div>
                <div><strong>Team:</strong> {selectedProject.team}</div>
              </div>
            </Card>

            <Progress percent={selectedProject.progress} strokeColor="#52c41a" />

            <Card size="small" title="Project Description" className="mt-4">
              <p>This quality improvement project aims to {selectedProject.title.toLowerCase()} through systematic process improvements, staff engagement, and evidence-based practices.</p>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
