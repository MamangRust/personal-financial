import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth";

const AccountListPage = () => {
  const { Search } = Input;
  const [searchedText, setSearchedText] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const {token, setToken} = useAuthStore();

  const handleDelete = async (id) => {
    try {
      const response = await invoke('delete_account', { token,accountId: id });
      console.log('Account deleted:', response);

      const newData = dataSource.filter(account => account.account_id !== id);
      setDataSource(newData);

      notification.info({
        message: 'Delete Account',
        description: 'Account deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete Account:', error);

      notification.error({
        message: 'Failed to Delete Account',
        description: 'Failed to delete Account. Please try again.'
      });
    }
  };

  const handleSearch = async (value) => {
    setSearchedText(value.toLowerCase());
    try {
      const response = await invoke('find_all_accounts', { token });
      const filteredData = response.filter((item) =>
        item.account_name.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const resetSearch = async () => {
    setSearchedText('');
    try {
      const response = await invoke('find_all_accounts', { token });
      setDataSource(response);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'account_id',
      key: 'account_id',
    },
    {
      title: 'Account Name',
      dataIndex: 'account_name',
      key: 'account_name',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
   {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency'
   },
   {
    title: "Created_at",
    dataIndex: "created_at",
    key: 'created_at'
   },
   {
    title: "Updated_at",
    dataIndex: "updated_at",
    key: 'updated_at'
   }
  ];

  const actionColumn = {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div>
        <Link to={`/admin/account/edit/${record.account_id}`}>
          <Button type='primary'>Update</Button>
        </Link>
        <Button type='primary' onClick={() => handleDelete(record.account_id)} danger>Delete</Button>
      </div>
    ),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoke('find_all_accounts', { token });
        setDataSource(response)
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      }
    }
    fetchData()
  }, [])

  const updatedColumns = [...columns, actionColumn];

  return (
    <div>
      <Card title="Account List">
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>
          <Col span={8}>
            <Link to={"/admin/account/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add
              </Button>
            </Link>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Search
              placeholder="Search Account"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchedText}
              onChange={(e) => setSearchedText(e.target.value)}
              onSearch={handleSearch}
            />
            <Button onClick={resetSearch} style={{ marginLeft: 8 }}>
              Reset
            </Button>
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Table dataSource={dataSource} columns={updatedColumns} />
      </Card>
    </div>
  );
};

export default AccountListPage;
