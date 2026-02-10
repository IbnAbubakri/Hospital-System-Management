'use client';

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Input, Space, Tag, Typography, Row, Col, Select, Tabs, Badge } from 'antd';
import { SearchOutlined, PlusOutlined, FilterOutlined, ExperimentOutlined, DotChartOutlined, HeartOutlined, DropboxOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface LabTest {
  id: string;
  code: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Immunology' | 'Hormones' | 'Cardiac' | 'Other';
  sampleType: 'Blood' | 'Urine' | 'Swab' | 'Tissue' | 'Other';
  price: number;
  duration: string;
  status: 'Active' | 'Inactive';
}

export default function LabCatalogPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState('all');

  const [labTests] = useState<LabTest[]>([
    {
      id: '1',
      code: 'CBC',
      name: 'Complete Blood Count',
      category: 'Hematology',
      sampleType: 'Blood',
      price: 2500,
      duration: '1 hour',
      status: 'Active',
    },
    {
      id: '2',
      code: 'LIPID',
      name: 'Lipid Profile',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 3500,
      duration: '2 hours',
      status: 'Active',
    },
    {
      id: '3',
      code: 'HBA1C',
      name: 'HbA1c',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 3000,
      duration: '2 hours',
      status: 'Active',
    },
    {
      id: '4',
      code: 'URIC',
      name: 'Urine Routine & Microscopy',
      category: 'Microbiology',
      sampleType: 'Urine',
      price: 2000,
      duration: '1 hour',
      status: 'Active',
    },
    {
      id: '5',
      code: 'TSH',
      name: 'Thyroid Stimulating Hormone',
      category: 'Hormones',
      sampleType: 'Blood',
      price: 4000,
      duration: '3 hours',
      status: 'Active',
    },
    {
      id: '6',
      code: 'TROP',
      name: 'Troponin I',
      category: 'Cardiac',
      sampleType: 'Blood',
      price: 5000,
      duration: '30 mins',
      status: 'Active',
    },
    {
      id: '7',
      code: 'BS',
      name: 'Blood Sugar (Fasting)',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 1500,
      duration: '30 mins',
      status: 'Active',
    },
    {
      id: '8',
      code: 'MP',
      name: 'Malaria Parasite',
      category: 'Microbiology',
      sampleType: 'Blood',
      price: 2000,
      duration: '1 hour',
      status: 'Active',
    },
    {
      id: '9',
      code: 'WIDAL',
      name: 'Widal Test',
      category: 'Microbiology',
      sampleType: 'Blood',
      price: 2500,
      duration: '2 hours',
      status: 'Active',
    },
    {
      id: '10',
      code: 'ELEC',
      name: 'Electrolytes',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 3000,
      duration: '1 hour',
      status: 'Active',
    },
    {
      id: '11',
      code: 'LFT',
      name: 'Liver Function Test',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 4500,
      duration: '2 hours',
      status: 'Active',
    },
    {
      id: '12',
      code: 'KFT',
      name: 'Kidney Function Test',
      category: 'Biochemistry',
      sampleType: 'Blood',
      price: 4000,
      duration: '2 hours',
      status: 'Active',
    },
  ]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Hematology': <DropboxOutlined />,
      'Biochemistry': <ExperimentOutlined />,
      'Microbiology': <DotChartOutlined />,
      'Immunology': <HeartOutlined />,
      'Hormones': <HeartOutlined />,
      'Cardiac': <HeartOutlined />,
    };
    return icons[category] || <ExperimentOutlined />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Hematology': 'red',
      'Biochemistry': 'blue',
      'Microbiology': 'green',
      'Immunology': 'purple',
      'Hormones': 'orange',
      'Cardiac': 'magenta',
    };
    return colors[category] || 'default';
  };

  const getSampleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Blood': 'red',
      'Urine': 'yellow',
      'Swab': 'blue',
      'Tissue': 'green',
    };
    return colors[type] || 'default';
  };

  const filteredTests = useMemo(() => {
    return labTests.filter((test) => {
      const matchesSearch =
        test.name.toLowerCase().includes(searchText.toLowerCase()) ||
        test.code.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !categoryFilter || test.category === categoryFilter;
      const matchesTab = activeTab === 'all' || test.category.toLowerCase() === activeTab;
      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [searchText, categoryFilter, activeTab, labTests]);

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Test Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: LabTest) => (
        <Space>
          {getCategoryIcon(record.category)}
          <span className="font-medium">{name}</span>
        </Space>
      ),
      sorter: (a: LabTest, b: LabTest) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)} icon={getCategoryIcon(category)}>
          {category}
        </Tag>
      ),
    },
    {
      title: 'Sample Type',
      dataIndex: 'sampleType',
      key: 'sampleType',
      render: (type: string) => <Tag color={getSampleTypeColor(type)}>{type}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => <span className="font-medium">₦{price.toLocaleString()}</span>,
      sorter: (a: LabTest, b: LabTest) => a.price - b.price,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: LabTest) => (
        <Space>
          <Button type="link" size="small">View Details</Button>
          <Button type="link" size="small">Order</Button>
        </Space>
      ),
    },
  ];

  const categories = ['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Hormones', 'Cardiac'];

  const tabItems = [
    { key: 'all', label: `All Tests (${labTests.length})` },
    ...categories.map((cat) => ({
      key: cat.toLowerCase(),
      label: `${cat} (${labTests.filter((t: any) => t.category === cat).length})`,
    })),
  ];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">Laboratory Test Catalog</Title>
          <Text type="secondary">Browse and order laboratory tests</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">
          Add New Test
        </Button>
      </div>

      <Card className="mb-6">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Search
              placeholder="Search tests by name or code..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              style={{ width: '100%' }}
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Text type="secondary">
              Showing <strong>{filteredTests.length}</strong> of <strong>{labTests.length}</strong> tests
            </Text>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <Table
          dataSource={filteredTests}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}
