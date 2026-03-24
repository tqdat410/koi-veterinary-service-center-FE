import React, { FC } from 'react';
import '../../styles/LeftSideBar.css'; // Import the CSS file
import { useState } from 'react';

interface SideMenuProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  
}

const SideMenu: FC<SideMenuProps> = ({ activeMenu, onMenuClick }) => {

  const [isPriceOpen, setIsPriceOpen] = useState(false); // Trạng thái mở/đóng sub-menu Price Management

  const togglePriceMenu = () => {
    setIsPriceOpen(!isPriceOpen); // Đổi trạng thái mở/đóng
  };

  return (
    <div className="left-sidebar d-flex flex-column bg-light vh-100 p-3 ">
      <div className='mt-2'>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'shift' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('shift')}
        >
          <i className="bi bi-calendar"></i> Veterinarian shift management
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'history' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('history')}
        >
          <i className="bi bi-clock"></i> Appointment history
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link  ${activeMenu === 'customer' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('customer')}
        >
          <i className="bi bi-person"></i> Customer management
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'staff' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('staff')}
        >
          <i className="bi bi-person-workspace"></i> Staff management
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'feedback' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('feedback')}
        >
          <i className="bi bi-chat-dots"></i> Feedback & Rating
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'reports' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('reports')}
        >
          <i className="bi bi-bar-chart"></i> Dashboard & Reports
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'price' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('price')}
        >
          <i className="bi bi-currency-dollar" /> Price management
          <i className={`dropdown-toggle`} style={{ paddingLeft: '10px' }} />
        </a>

          {/*  chưa làm, iteration 2 sẽ làm  */}

      </div>

      <div className="mt-auto mb-3" style={{ flexGrow: 1 }}></div>

      <div className='nav-bottom'>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'messages' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('messages')}
        >
          <i className="bi bi-chat-dots"></i> Messages
        </a>
        <a
          href="#"
          className={`nav-link child-nav-link ${activeMenu === 'settings' ? 'active-menu' : ''}`}
          onClick={() => onMenuClick('settings')}
        >
          <i className="bi bi-gear"></i> Settings
        </a>
      </div>
    </div>
  );
};

export default SideMenu;
