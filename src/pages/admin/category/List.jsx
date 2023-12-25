import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined, FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons"

import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth'



const CategoryListPage = () => {
  const { Search } = Input

  const [searchedText, setSearchedText] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const {token, setToken} = useAuthStore()

  const handleDelete = async (id) => {
    try {
        const response = await invoke('delete_category', { token,categoryId: id });
        console.log('Category deleted:', response);

        const newData = dataSource.filter(category => category.category_id !== id);
        setDataSource(newData);

        notification.info({
            message: 'Delete Category',
            description: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete Category:', error);

        notification.error({
            message: 'Failed to Delete Category',
            description: 'Failed to delete Category. Please try again.'
        });
    }
};


  const handleSearch = async (value) => {
    setSearchedText(value.toLowerCase());
    try {
      const response = await invoke("find_all_categories", { token });
      const filteredData = response.filter((item) =>
        item.category_name.toLowerCase().includes(value.toLowerCase())
      );
      setDataSource(filteredData);
    } catch (error) {
      console.error('Failed to fetch category:', error);
    }
  };

  const resetSearch = async () => {
    setSearchedText('');
    try {
      const response = await invoke("find_all_categories", { token });
      setDataSource(response);
    } catch (error) {
      console.error('Failed to fetch Category:', error);
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'category_id',
      key: 'category_id',
    },
    {
      title: 'Name',
      dataIndex: 'category_name',
      key: 'category_name',
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
        <Link to={`/admin/category/edit/${record.category_id}`}>
          <Button type='primary'>Update</Button>
        </Link>
        <Button type='primary' onClick={() => handleDelete(record.category_id)} danger>Delete</Button>
      </div>
    ),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await invoke("find_all_categories", { token });

        setDataSource(response)
      } catch (err) {

        
        console.log("Failed to fetch Category: ", err)
      }
    }

    fetchData()
  }, [])



  const updatedColumns = [...columns, actionColumn];

  return (
    <div>
      <Card title="Table Category">
        <Row justify="space-between" align="middle" style={{ width: '100%' }}>

          <Col span={8}>
            <Link to={"/admin/category/add"}>
              <Button type="primary" icon={<PlusOutlined />}>
                Add
              </Button>
            </Link>

          </Col>


          <Col span={8} style={{ textAlign: 'right' }}>
            <Search
              placeholder="Search Category"
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

export default CategoryListPage;
