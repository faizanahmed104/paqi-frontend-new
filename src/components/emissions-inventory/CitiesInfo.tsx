import Tabs from '@/ui-elements/Tabs';
import React from 'react';
import Lahore from './Lahore';

function CitiesInfo() {
  const CITIES_INFO = [
    {
      label: 'Lahore',
      content: <Lahore />,
    },
    {
      label: 'Karachi',
      content: <p>Here are more detailed insights...</p>,
    },
    {
      label: 'Islamabad',
      content: <p>Settings go here.</p>,
    },
    {
      label: 'Peshawar',
      content: <p>Settings go here.</p>,
    },
  ];
  return (
    <div className="text-center my-10">
      <Tabs tabs={CITIES_INFO} defaultIndex={0} />
    </div>
  );
}

export default CitiesInfo;
