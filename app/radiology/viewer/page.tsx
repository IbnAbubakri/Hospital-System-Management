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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4  sm: ">
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
      <div className="  h-[calc(100vh-320px)]">
        {/* Studies List */}
        <div
          className=" bg-white -xl border border-gray-200  overflow-y-auto"
        >
          <h3 className=" font-semibold  ">Recent Studies</h3>
          <div className=" -col ">
            {studies.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedStudy(item)}
                className={` -xl border cursor-pointer transition-all duration-200 ${selectedStudy?.id === item.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'}`}
              >
                <div className=" items-start ">
                  <div className="  -lg bg-blue-100    -shrink-0">
                    <FileImageOutlined className=" " />
                  </div>
                  <div className="-1 min-">
                    <div className=" -col sm:-row items-start sm:    ">
                      <span className="font-medium  ">{item.studyType}</span>
                      <span
                        className={` .5   font-medium ${item.status === 'final' ? 'bg-green-100 ' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="  ">{item.patient} ({item.mrn})</div>
                    <div className=" ">{item.date} • {item.view} • {item.images} images</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Viewer */}
        <div
          className="-1 bg-white -xl border border-gray-200   -col"
        >
          {selectedStudy ? (
            <>
              {/* Header */}
              <div className=" -col sm:-row items-start sm:   ">
                <div>
                  <h2 className="text-xl font-semibold  ">
                    {selectedStudy.studyType} - {selectedStudy.view}
                  </h2>
                  <p className=" ">{selectedStudy.patient} • {selectedStudy.mrn}</p>
                </div>
                <div className=" ">
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
                <div className="grid grid-cols-3  ">
                  <div>
                    <div className=" text-slate-500 ">Study ID</div>
                    <div className=" font-medium ">{selectedStudy.id}</div>
                  </div>
                  <div>
                    <div className=" text-slate-500 ">Date</div>
                    <div className=" font-medium ">{selectedStudy.date}</div>
                  </div>
                  <div>
                    <div className=" text-slate-500 ">Time</div>
                    <div className=" font-medium ">{selectedStudy.time}</div>
                  </div>
                  <div>
                    <div className=" text-slate-500 ">Patient</div>
                    <div className=" font-medium ">{selectedStudy.patient}</div>
                  </div>
                  <div>
                    <div className=" text-slate-500 ">MRN</div>
                    <div className=" font-medium ">{selectedStudy.mrn}</div>
                  </div>
                  <div>
                    <div className=" text-slate-500 ">Radiologist</div>
                    <div className=" font-medium ">{selectedStudy.radiologist}</div>
                  </div>
                </div>
              </InfoCard>

              {/* Image Display Area */}
              <div className="-1   ">
                {/* Main Image Viewer */}
                  <div className="-1 bg-black -xl    relative overflow-hidden">
                    <FileImageOutlined className="text-8xl " />
                    <div className="absolute  text-center">
                      <div className="text-3xl font-bold ">
                      {selectedStudy.studyType}
                    </div>
                      <div className="text-base opacity-80">Image 1 of {selectedStudy.images}</div>
                  </div>
                </div>

                {/* Tools Panel */}
                <div className="w-[280px]  -col ">
                  {/* Image Adjustments */}
                  <div className=" bg-white -xl border border-gray-200">
                    <h4 className=" font-semibold  ">Image Adjustments</h4>
                    <div className="">
                      <div className="  ">
                        <span className=" ">Brightness</span>
                        <span className=" font-medium">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="  ">
                        <span className=" ">Contrast</span>
                        <span className=" font-medium">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={200}
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Image Navigation */}
                  <div className=" bg-white -xl border border-gray-200">
                    <h4 className=" font-semibold  ">Image Navigation</h4>
                    <div className="grid grid-cols-3 ">
                      {Array.from({ length: Math.min(selectedStudy.images, 9) }, (_, i) => (
                        <div
                          key={i}
                          className={`h-[60px]    -lg cursor-pointer font-medium  ${i === 0 ? 'bg-gray-100 border-2 border-blue-500 ' : 'bg-gray-100 border border-gray-200 '}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className=" bg-white -xl border border-gray-200">
                    <h4 className=" font-semibold  ">Tools</h4>
                    <div className=" -col ">
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
                  <div className=" bg-white -xl border border-gray-200">
                <h4 className=" font-semibold  ">Impressions</h4>
                <ul className="list-disc pl-5 m-0">
                  <li className="  ">No active cardiopulmonary process</li>
                  <li className="  ">Normal cardiac size and contour</li>
                  <li className=" ">Lung fields clear without infiltrates</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="-1    ">
              <div className="text-center">
                <FileImageOutlined className="text-8xl " />
                <p className="">Select a radiology study to view images</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
