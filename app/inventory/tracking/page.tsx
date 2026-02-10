'use client';

import React from 'react';
import { Card, Typography, Timeline, Tag, Space, Input } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function InventoryTrackingPage() {
  const [searchText, setSearchText] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const items = [
    { id: 'ITEM-001', name: 'Paracetamol 500mg', batch: 'BTH-2024-0156', currentLocation: 'Pharmacy', quantity: 500, status: 'In Stock' },
    { id: 'ITEM-002', name: 'Surgical Gloves', batch: 'BTH-2024-0155', currentLocation: 'OT Store', quantity: 1000, status: 'In Stock' },
    { id: 'ITEM-003', name: 'Insulin Pens', batch: 'BTH-2024-0154', currentLocation: 'Refrigerator A', quantity: 50, status: 'Low Stock' },
    { id: 'ITEM-004', name: 'IV Cannulas', batch: 'BTH-2024-0153', currentLocation: 'Emergency', quantity: 200, status: 'In Stock' },
  ];

  const trackingHistory = [
    { date: '2024-02-05 09:30', action: 'Received', location: 'Main Store', quantity: 500, user: 'Chukwu Emeka' },
    { date: '2024-02-05 10:15', action: 'Transfer Initiated', location: 'Main Store → Pharmacy', quantity: 500, user: 'Ifeanyi Okonkwo' },
    { date: '2024-02-05 11:00', action: 'In Transit', location: 'Corridor B', quantity: 500, user: 'System' },
    { date: '2024-02-05 11:30', action: 'Delivered', location: 'Pharmacy', quantity: 500, user: 'Amina Yusuf' },
    { date: '2024-02-05 14:00', action: 'Stock Updated', location: 'Pharmacy Shelf A', quantity: 500, user: 'Grace Okafor' },
  ];

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.batch.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={3}>Inventory Tracking</Title>

      <div className="flex flex-col lg:flex-row gap-6">
        <Card title="Items" className="flex-1" style={{ flex: 1 }}>
          <Input.Search
            placeholder="Search items..."
            allowClear
            style={{ marginBottom: '16px' }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                size="small"
                hoverable
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer', border: selectedItem?.id === item.id ? '2px solid #1890ff' : undefined }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong>{item.name}</Text>
                    <br />
                    <Text type="secondary">Batch: {item.batch}</Text>
                    <br />
                    <Text type="secondary">
                      <EnvironmentOutlined /> {item.currentLocation}
                    </Text>
                  </div>
                  <Tag color={item.status === 'In Stock' ? 'success' : 'warning'}>{item.status}</Tag>
                </div>
              </Card>
            ))}
          </Space>
        </Card>

        {selectedItem && (
          <Card title={`Tracking History: ${selectedItem.name}`} className="flex-1" style={{ flex: 1 }}>
            <Space orientation="vertical" style={{ width: '100%', marginBottom: '16px' }}>
              <div><Text strong>Batch No:</Text> {selectedItem.batch}</div>
              <div><Text strong>Current Location:</Text> {selectedItem.currentLocation}</div>
              <div><Text strong>Quantity:</Text> {selectedItem.quantity}</div>
            </Space>
            <Timeline
              items={trackingHistory.map((event) => ({
                children: (
                  <div>
                    <Text strong>{event.action}</Text>
                    <br />
                    <Text type="secondary">{event.location}</Text>
                    <br />
                    <Text type="secondary">Qty: {event.quantity} | By: {event.user}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{event.date}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
