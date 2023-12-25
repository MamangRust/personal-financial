import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons"

import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';



const UserListPage = () => {
  const { Search } = Input

  const [searchedText, setSearchedText] = useState('');
  const [dataSource, setDataSource] = useState([]);

  const handleDelete = async (id) => {
    try {
        const response = await invoke('delete_user', { id });
        console.log('User deleted:', response);

        const newData = dataSource.filter(user => user.user_id !== id);
        setDataSource(newData);

        notification.info({
            message: 'Delete User',
            description: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete user:', error);

        notification.error({
            message: 'Failed to Delete User',
            description: 'Failed to delete user. Please try again.'
        });
    }
};


  const handleSearch = async (value) => {
    setSearchedText(value.toLowerCase());
    try {
      const response = await invoke('find_all_user');
      const filteredData = response.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const resetSearch = async () => {
    setSearchedText('');
    try {
      const response = await invoke('find_all_user');
      setDataSource(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
  ];

  const actionColumn = {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div>
        <Link to={`/admin/user/edit/${record.user_id}`}>
          <Button type='primary'>Update</Button>
        </Link>
        <Button type='primary' onClick={() => handleDelete(record.user_id)} danger>Delete</Button>
      </div>
    ),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoke("find_all_user");
        setDataSource(response)
      } catch (err) {

        
        console.log("Failed to fetch users: ", err)
      }
    }

    fetchData()
  }, [])


 

  const updatedColumns = [...columns, actionColumn];

  return (
    <div>
      <Card title="Table user">
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>

          <Col span={8}>
            <Link to={"/admin/user/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add
              </Button>
            </Link>

          </Col>


          <Col span={8} style={{ textAlign: 'right' }}>
            <Search
              placeholder="Search users"
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

export default UserListPage;
