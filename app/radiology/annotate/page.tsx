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
    { id: 'measurement', label: 'Measure', icon: 'Ruler' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'angle', label: 'Angle', icon: '∠' },
  ];

  return (
    <div className="  sm: sm: lg: lg: max-w-7xl mx-auto">
      <Title level={3}>Image Annotation Tool</Title>

      <div className=" ">
        <Card title="Toolbox" className="w-[280px]">
          <Space direction="vertical" className="w-full" size="middle">
            <div>
              <div className="font-medium ">Drawing Tools</div>
              <div className="grid grid-cols-3 ">
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
              <div className="font-medium ">Line Width</div>
              <Slider min={1} max={10} defaultValue={2} />
            </div>

            <div>
              <div className="font-medium ">Color</div>
              <div className=" ">
                {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'].map((color) => (
                  <div
                    className="   cursor-pointer border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="font-medium ">Opacity</div>
              <Slider min={0} max={100} defaultValue={100} />
            </div>

            <Button type="primary" block icon={<SaveOutlined />}>Save Annotations</Button>
            <Button block icon={<UndoOutlined />}>Undo</Button>
            <Button block>Clear All</Button>
          </Space>
        </Card>

        <Card
          title="Chest X-Ray - PA View"
          className="-1"
          extra={
            <Space>
              <Tag color="blue">1 of 2</Tag>
              <Button size="small">Previous</Button>
              <Button size="small">Next</Button>
            </Space>
          }
        >
          <div className="bg-black h-[500px]    relative -lg">
            <div className=" text-center">
              <div className=" font-bold ">CHEST X-RAY</div>
              <div className=" opacity-70">PA View</div>
            </div>

            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute      cursor-move"
                style={{ left: annotation.x, top: annotation.y, backgroundColor: annotation.color }}
              >
                {annotation.label}
              </div>
            ))}
          </div>

          <Card size="small" title="Annotation Legend" className="">
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
                        className="  "
                        style={{ backgroundColor: item.color }}
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

        <Card title="Study Information" className="">
          <Space direction="vertical" className="w-full" size="middle">
            <div>
              <div className=" ">Study ID</div>
              <div className="font-medium">RAD-2024-0892</div>
            </div>
            <div>
              <div className=" ">Patient</div>
              <div className="font-medium">Ngozi Eze</div>
              <div className="">MRN-2024-0005</div>
            </div>
            <div>
              <div className=" ">Modality</div>
              <Tag color="purple">X-Ray</Tag>
            </div>
            <div>
              <div className=" ">Date/Time</div>
              <div className="font-medium">2024-02-05 10:30</div>
            </div>
            <div>
              <div className=" ">Radiologist</div>
              <div className="font-medium">Dr. Okafor</div>
            </div>
            <div>
              <div className=" ">Status</div>
              <Tag color="success">Final</Tag>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
