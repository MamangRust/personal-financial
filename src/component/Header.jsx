import React from 'react';
import { BellOutlined, MessageOutlined, ProfileOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Button, Layout, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom';

const Headers = ({ collapsed, setCollapsed, colorBgContainer }) => {
  const { Header } = Layout
  const navigate = useNavigate();


  const onClick = ({ key }) => {
    if (key === 'profile') {

      
      notification.info({
        message: 'Profile Clicked',
        description: 'Redirecting to Profile...',
      });
    } else if (key === 'logout') {

      notification.warning({
        message: 'Logged Out',
        description: 'You have been logged out!',
      });

    }
  };

  

  const items = [
    {
      key: 'profile',
      label: (
        <Link to="/profile">
          <span>
            <ProfileOutlined />
            <span style={{ marginLeft: '8px' }}>Profile</span>
          </span>
        </Link>
      ),
    },
    {
      key: 'logout',
      label: (
        <Link to="/logout">
          <span>
            <LogoutOutlined />
            <span style={{ marginLeft: '8px' }}>Logout</span>
          </span>
        </Link>
      ),
    },
  ];



  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: 'right', marginRight: '24px' }}>
        <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
        <Button type="text" icon={<MessageOutlined />} style={{ fontSize: '16px' }} />
        <Dropdown menu={{
          items,
          onClick,
        }} placement="bottom" arrow>
          <Button type="text" icon={<ProfileOutlined />} style={{ fontSize: '16px' }} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Headers;
