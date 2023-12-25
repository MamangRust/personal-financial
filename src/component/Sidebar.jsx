import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  UploadOutlined,
  DollarOutlined,
  TransactionOutlined,
  FundOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const { Sider } = Layout;

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical" style={{ marginBottom: '10px', padding: '16px', textAlign: 'center' }}>
        <h1 style={{ color: 'white' }}>Personal</h1>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/admin/user">User</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<AppstoreOutlined />}>
          <Link to="/admin/category">Category</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<DollarOutlined />}>
          <Link to="/admin/account">Accounts</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<TransactionOutlined />}>
          <Link to="/admin/transaction">Transaction</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<FundOutlined />}>
          <Link to="/admin/budget">Budgets</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<FlagOutlined />}>
          <Link to="/admin/goal">Goals</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<UploadOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
