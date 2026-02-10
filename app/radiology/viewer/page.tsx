'use client';

import React from 'react';
import { FileImageOutlined, ZoomInOutlined, DownloadOutlined, RotateLeftOutlined, RotateRightOutlined } from '@ant-design/icons';
import { PageShell, StatCard, InfoCard, GradientButton } from '@/components/design-system';

interface Study {
  id: string;
  patient: string;
  mrn: string;
  studyType: string;
  view: string;
  date: string;
  time: string;
  radiologist: string;
  status: string;
  impressions: number;
  images: number;
}

export default function RadiologyViewerPage() {
  const [selectedStudy, setSelectedStudy] = React.useState<Study | null>(null);
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);

  const studies: Study[] = [
    {
      id: 'RAD-2024-0892',
      patient: 'Ngozi Eze',
      mrn: 'MRN-2024-0005',
      studyType: 'Chest X-Ray',
      view: 'PA View',
      date: '2024-02-05',
      time: '10:30',
      radiologist: 'Dr. Okafor',
      status: 'final',
      impressions: 3,
      images: 2,
    },
    {
      id: 'RAD-2024-0891',
      patient: 'Chukwuemeka Okonkwo',
      mrn: 'MRN-2024-0001',
      studyType: 'CT Scan - Abdomen',
      view: 'Contrast Enhanced',
      date: '2024-02-04',
      time: '14:20',
      radiologist: 'Dr. Eze',
      status: 'preliminary',
      impressions: 5,
      images: 45,
    },
    {
      id: 'RAD-2024-0890',
      patient: 'Tobi Okafor',
      mrn: 'MRN-2024-0007',
      studyType: 'Ultrasound - Abdomen',
      view: 'Grayscale',
      date: '2024-02-03',
      time: '09:15',
      radiologist: 'Dr. Nnamdi',
      status: 'final',
      impressions: 2,
      images: 12,
    },
    {
      id: 'RAD-2024-0889',
      patient: 'Adaobi Nwosu',
      mrn: 'MRN-2024-0003',
      studyType: 'MRI Brain',
      view: 'T2 Weighted',
      date: '2024-02-02',
      time: '16:45',
      radiologist: 'Dr. Okonkwo',
      status: 'final',
      impressions: 4,
      images: 28,
    },
  ];

  const totalStudies = studies.length;
  const pendingReports = studies.filter(s => s.status === 'preliminary').length;
  const totalImages = studies.reduce((sum, s) => sum + s.images, 0);
  const finalReports = studies.filter(s => s.status === 'final').length;

  return (
    <PageShell
      title="Radiology Image Viewer"
      subtitle="View and analyze radiology studies and images"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        <StatCard
          label="Total Studies"
          value={totalStudies}
          color="#3B82F6"
          bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
          border="#93C5FD"
          index={0}
        />
        <StatCard
          label="Pending Reports"
          value={pendingReports}
          color="#F59E0B"
          bg="linear-gradient(135deg, #FEF3C7 0%, rgba(255,255,255,0.8) 100%)"
          border="#FCD34D"
          index={1}
        />
        <StatCard
          label="Total Images"
          value={totalImages}
          color="#8B5CF6"
          bg="linear-gradient(135deg, #EDE9FE 0%, rgba(255,255,255,0.8) 100%)"
          border="#C4B5FD"
          index={2}
        />
        <StatCard
          label="Final Reports"
          value={finalReports}
          color="#10B981"
          bg="linear-gradient(135deg, #D1FAE5 0%, rgba(255,255,255,0.8) 100%)"
          border="#6EE7B7"
          index={3}
        />
      </div>

      {/* Image Viewer Section */}
      <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 320px)' }}>
        {/* Studies List */}
        <div
          style={{
            width: '400px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            overflowY: 'auto',
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Studies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {studies.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedStudy(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedStudy?.id === item.id ? '#EFF6FF' : 'white',
                  padding: '16px',
                  borderRadius: '10px',
                  border: `1px solid ${selectedStudy?.id === item.id ? '#3B82F6' : '#E2E8F0'}`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedStudy?.id !== item.id) {
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStudy?.id !== item.id) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: '#DBEAFE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileImageOutlined style={{ fontSize: '18px', color: '#3B82F6' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{item.studyType}</span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 500,
                          background: item.status === 'final' ? '#D1FAE5' : '#FEF3C7',
                          color: item.status === 'final' ? '#059669' : '#D97706',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{item.patient} ({item.mrn})</div>
                    <div className="text-xs text-gray-400">{item.date} • {item.view} • {item.images} images</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Viewer */}
        <div
          style={{
            flex: 1,
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {selectedStudy ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {selectedStudy.studyType} - {selectedStudy.view}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedStudy.patient} • {selectedStudy.mrn}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <GradientButton variant="secondary" size="small" icon={<ZoomInOutlined />}>
                    Zoom
                  </GradientButton>
                  <GradientButton variant="secondary" size="small" icon={<RotateLeftOutlined />} />
                  <GradientButton variant="secondary" size="small" icon={<RotateRightOutlined />} />
                  <GradientButton variant="primary" size="small" icon={<DownloadOutlined />}>
                    Export
                  </GradientButton>
                </div>
              </div>

              {/* Study Details */}
              <InfoCard
                title="Study Information"
                icon={<FileImageOutlined />}
                color="#3B82F6"
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Study ID</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.id}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Date</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Time</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.time}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Patient</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.patient}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>MRN</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.mrn}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Radiologist</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{selectedStudy.radiologist}</div>
                  </div>
                </div>
              </InfoCard>

              {/* Image Display Area */}
              <div style={{ flex: 1, display: 'flex', gap: '16px', marginBottom: '16px' }}>
                {/* Main Image Viewer */}
                <div
                  style={{
                    flex: 1,
                    background: '#000',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <FileImageOutlined style={{ fontSize: '80px', color: '#333' }} />
                  <div style={{ position: 'absolute', color: '#fff', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {selectedStudy.studyType}
                    </div>
                    <div style={{ fontSize: '16px', opacity: 0.8 }}>Image 1 of {selectedStudy.images}</div>
                  </div>
                </div>

                {/* Tools Panel */}
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Image Adjustments */}
                  <div
                    style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Image Adjustments</h4>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Brightness</span>
                        <span className="text-sm font-medium">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Contrast</span>
                        <span className="text-sm font-medium">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Image Navigation */}
                  <div
                    style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Image Navigation</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {Array.from({ length: Math.min(selectedStudy.images, 9) }, (_, i) => (
                        <div
                          key={i}
                          style={{
                            backgroundColor: '#F3F4F6',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: i === 0 ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                            fontWeight: 500,
                            fontSize: '13px',
                            color: i === 0 ? '#3B82F6' : '#6B7280',
                          }}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div
                    style={{
                      padding: '16px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tools</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <GradientButton variant="secondary" size="small" block>
                        Measure
                      </GradientButton>
                      <GradientButton variant="secondary" size="small" block>
                        Annotate
                      </GradientButton>
                      <GradientButton variant="secondary" size="small" block>
                        Invert
                      </GradientButton>
                      <GradientButton variant="secondary" size="small" block>
                        Window/Level
                      </GradientButton>
                      <GradientButton variant="secondary" size="small" block>
                        Pan/Zoom
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impressions */}
              <div
                style={{
                  padding: '16px',
                  background: 'white',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Impressions</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li className="text-sm text-gray-700 mb-2">No active cardiopulmonary process</li>
                  <li className="text-sm text-gray-700 mb-2">Normal cardiac size and contour</li>
                  <li className="text-sm text-gray-700">Lung fields clear without infiltrates</li>
                </ul>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <FileImageOutlined style={{ fontSize: '80px', marginBottom: '16px' }} />
                <p className="text-lg">Select a radiology study to view images</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
