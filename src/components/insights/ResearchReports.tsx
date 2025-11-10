import React from 'react';
import Tabs from '@/ui-elements/Tabs';

function ResearchReports() {
  const CITIES_INFO = [
    {
      label: 'All',
      content: 'Blogs',
    },
    {
      label: 'Research Papers',
      content: <p>Here are more detailed insights...</p>,
    },
    {
      label: 'Emissions Inventory',
      content: <p>Settings go here.</p>,
    },
    {
      label: 'News Articles',
      content: <p>Settings go here.</p>,
    },
  ];
  return (
    <div>
      <h1 className="text-center text-4xl my-10">Research and Reports</h1>
      <div className="flex justify-start max-w-7xl mx-auto px-6">
        <span className="mt-2 mr-5 text-lg text">Filter by:</span>
        <Tabs tabs={CITIES_INFO} defaultIndex={0} />
      </div>
    </div>
  );
}

export default ResearchReports;
