'use client';

import React from 'react';
import { Card, Typography, Table, Space, Button, Tag, Progress, Row, Col, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function InventoryStockPage() {
  const stockItems = [
    { id: '1', name: 'Paracetamol 500mg', category: 'Medication', currentStock: 500, minStock: 100, maxStock: 1000, location: 'Pharmacy A1' },
    { id: '2', name: 'Surgical Gloves', category: 'Supplies', currentStock: 50, minStock: 100, maxStock: 500, location: 'Store Room B2' },
    { id: '3', name: 'Syringes 5ml', category: 'Supplies', currentStock: 150, minStock: 200, maxStock: 1000, location: 'Store Room A3' },
    { id: '4', name: 'Blood Pressure Monitor', category: 'Equipment', currentStock: 8, minStock: 5, maxStock: 15, location: 'Ward 1' },
  ];

  const columns = [
    { title: 'Item', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat: string) => <Tag>{cat}</Tag> },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Stock Level',
      key: 'level',
      render: (_: any, item: any) => {
        const percentage = (item.currentStock / item.maxStock) * 100;
        return (
          <div>
            <Text strong>{item.currentStock} / {item.maxStock}</Text>
            <Progress
              percent={percentage}
              status={item.currentStock <= item.minStock ? 'exception' : 'normal'}
              size="small"
              style={{ marginTop: '4px' }}
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, item: any) => {
        if (item.currentStock === 0) return <Tag color="error">Out of Stock</Tag>;
        if (item.currentStock <= item.minStock) return <Tag color="warning">Low Stock</Tag>;
        return <Tag color="success">In Stock</Tag>;
      },
    },
  ];

  const lowStockCount = stockItems.filter((i: any) => i.currentStock <= i.minStock).length;
  const outOfStockCount = stockItems.filter((i: any) => i.currentStock === 0).length;

  return (
    <div className=" max-w-7xl mx-auto">
      <Title level={3}>Real-Time Stock Levels</Title>

      {lowStockCount > 0 && (
        <Alert
          title={`${lowStockCount} items need restocking`}
          description="Please review and place purchase orders"
          type="warning"
          showIcon
          className=""
        />
      )}

      <Row gutter={[16, 16]} className="">
        <Col span={8}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold ">{stockItems.length}</div>
              <div className=" ">Total Items</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold ">{lowStockCount}</div>
              <div className=" ">Low Stock</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold ">{outOfStockCount}</div>
              <div className=" ">Out of Stock</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Stock Inventory">
        <Table dataSource={stockItems} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
