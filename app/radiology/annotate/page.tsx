'use client';

import React from 'react';
import { Card, Typography, Button, Space, List, Tag, ColorPicker, Select, Slider } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function RadiologyAnnotatePage() {
  const [annotations, setAnnotations] = React.useState([
    { id: 1, type: 'Arrow', color: '#ff0000', label: 'Nodule detected', x: 250, y: 180 },
    { id: 2, type: 'Circle', color: '#00ff00', label: 'Normal area', x: 400, y: 300 },
    { id: 3, type: 'Measurement', color: '#0000ff', label: '3.2 cm', x: 320, y: 220 },
  ]);

  const [currentTool, setCurrentTool] = React.useState('arrow');

  const tools = [
    { id: 'arrow', label: 'Arrow', icon: '→' },
    { id: 'circle', label: 'Circle', icon: '○' },
    { id: 'rectangle', label: 'Rectangle', icon: '□' },
    { id: 'line', label: 'Line', icon: '/' },
    { id: 'measurement', label: 'Measurement', icon: '📏' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'angle', label: 'Angle', icon: '∠' },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Image Annotation Tool</Title>

      <div style={{ display: 'flex', gap: '24px' }}>
        <Card title="Toolbox" style={{ width: '280px' }}>
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div className="font-medium mb-2">Drawing Tools</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    type={currentTool === tool.id ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setCurrentTool(tool.id)}
                    title={tool.label}
                  >
                    {tool.icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Line Width</div>
              <Slider min={1} max={10} defaultValue={2} />
            </div>

            <div>
              <div className="font-medium mb-2">Color</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'].map((color) => (
                  <div
                    key={color}
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: color,
                      border: '1px solid #d9d9d9',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Opacity</div>
              <Slider min={0} max={100} defaultValue={100} />
            </div>

            <Button type="primary" block icon={<SaveOutlined />}>Save Annotations</Button>
            <Button block icon={<UndoOutlined />}>Undo</Button>
            <Button block>Clear All</Button>
          </Space>
        </Card>

        <Card
          title="Chest X-Ray - PA View"
          style={{ flex: 1 }}
          extra={
            <Space>
              <Tag color="blue">1 of 2</Tag>
              <Button size="small">Previous</Button>
              <Button size="small">Next</Button>
            </Space>
          }
        >
          <div
            style={{
              backgroundColor: '#000',
              height: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRadius: '8px',
            }}
          >
            <div style={{ color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>CHEST X-RAY</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>PA View</div>
            </div>

            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                style={{
                  position: 'absolute',
                  left: annotation.x,
                  top: annotation.y,
                  padding: '4px 8px',
                  backgroundColor: annotation.color,
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'move',
                }}
              >
                {annotation.label}
              </div>
            ))}
          </div>

          <Card size="small" title="Annotation Legend" className="mt-4">
            <List
              dataSource={annotations}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="link" size="small" icon={<EditOutlined />} />,
                    <Button type="link" size="small" danger icon={<DeleteOutlined />} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: item.color,
                          borderRadius: '4px',
                        }}
                      />
                    }
                    title={item.label}
                    description={`${item.type} at (${item.x}, ${item.y})`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Card>

        <Card title="Study Information" style={{ width: '300px' }}>
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div className="text-gray-500 text-sm">Study ID</div>
              <div className="font-medium">RAD-2024-0892</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Patient</div>
              <div className="font-medium">Ngozi Eze</div>
              <div className="text-sm">MRN-2024-0005</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Modality</div>
              <Tag color="purple">X-Ray</Tag>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Date/Time</div>
              <div className="font-medium">2024-02-05 10:30</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Radiologist</div>
              <div className="font-medium">Dr. Okafor</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Status</div>
              <Tag color="success">Final</Tag>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
