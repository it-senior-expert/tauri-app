import React, { useEffect, useState } from 'react';
import { useOutlet } from 'react-router-dom';
import { Splitter } from 'antd';
import Sidebar from '../../Sidebar';
import { saveToLocalStorage, loadFromLocalStorage } from '../../../services/store';

const SidebarLayout = () => {
  const outlet = useOutlet();
  const [leftWidth, setLeftWidth] = useState<number>(window.innerWidth * 0.8);

  const handleResize = (sizes: number[]) => {
    setLeftWidth(sizes[0]);
  };

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const fetchedWidth = await loadFromLocalStorage('width');
        if (typeof fetchedWidth === 'number') {
          setLeftWidth(fetchedWidth);
        }
      } catch (error) {
        console.error('Error fetching width:', error);
      }
    };
    fetchUrls();
  }, []);

  useEffect(() => {
    const setNewUrls = async () => {
      try {
        await saveToLocalStorage('width', leftWidth);
      } catch (error) {
        console.error('Error fetching width:', error);
      }
    };
    setNewUrls();
  }, [leftWidth]);

  return (
    <Splitter onResize={handleResize}>
      <Splitter.Panel defaultSize="80%" size={leftWidth} min="20%" max="90%">
        {outlet}
      </Splitter.Panel>
      <Splitter.Panel>
        <Sidebar />
      </Splitter.Panel>
    </Splitter>
  );
};

export default SidebarLayout;
