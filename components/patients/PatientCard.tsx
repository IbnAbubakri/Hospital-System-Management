'use client';

import React from 'react';
import { Card, Tag, Space, Typography, Button, Avatar } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Patient } from '@/types';
import { calculateAge } from '@/lib/utils';

const { Text, Paragraph } = Typography;

interface PatientCardProps {
  patient: Patient;
  onView?: () => void;
  onEdit?: () => void;
}

export function PatientCard({ patient, onView, onEdit }: PatientCardProps) {
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      active: 'success',
      inactive: 'default',
      deceased: 'error',
      transferred: 'warning',
    };
    return colorMap[status] || 'default';
  };

  return (
    <Card
      hoverable
      className="h-full"
      actions={[
        onEdit && <Button type="link" onClick={onEdit}>Edit</Button>,
        onView && <Button type="primary" onClick={onView}>View Details</Button>,
      ].filter(Boolean)}
    >
      <Space orientation="vertical" className="w-full" size="middle">
        <div className="flex items-start gap-4">
          <Avatar size={64} icon={<UserOutlined />} className="bg-blue-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <Text strong className="text-lg">
                {patient.firstName} {patient.lastName}
              </Text>
              <Tag color={getStatusColor(patient.status)}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Tag>
            </div>
            <Text type="secondary" className="text-sm">
              MRN: {patient.mrn}
            </Text>
            <br />
            <Text type="secondary" className="text-sm">
              Age: {calculateAge(patient.dateOfBirth)} | {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
            </Text>
            {patient.bloodGroup && (
              <>
                <br />
                <Tag color="blue">{patient.bloodGroup}</Tag>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PhoneOutlined className="text-gray-400" />
            <Text>{patient.contactNumber}</Text>
          </div>
          {patient.email && (
            <div className="flex items-center gap-2">
              <MailOutlined className="text-gray-400" />
              <Text>{patient.email}</Text>
            </div>
          )}
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-gray-400" />
            <Text className="text-sm">
              {patient.address.city}, {patient.address.state}
            </Text>
          </div>
        </div>

        {(patient.allergies.length > 0 || patient.chronicConditions.length > 0) && (
          <div className="pt-2 border-t">
            {patient.allergies.length > 0 && (
              <div className="mb-2">
                <Text type="secondary" className="text-xs">
                  Allergies:
                </Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies.map((allergy, index) => (
                    <Tag key={index} color="error" className="text-xs">
                      {allergy}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
            {patient.chronicConditions.length > 0 && (
              <div>
                <Text type="secondary" className="text-xs">
                  Chronic Conditions:
                </Text>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.chronicConditions.map((condition, index) => (
                    <Tag key={index} color="warning" className="text-xs">
                      {condition}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
}
