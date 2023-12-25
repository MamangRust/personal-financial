import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons"

import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';



const TransactionList = () => {
    const { Search } = Input

    const [searchedText, setSearchedText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const { token, setToken } = useAuthStore()


    const handleDelete = async (id) => {
        try {
            const response = await invoke('delete_transaction', { token, transactionId: id });
            console.log('Transaction deleted:', response);

            const newData = dataSource.filter(transaction => transaction.transaction_id !== id);
            setDataSource(newData);

            notification.info({
                message: 'Delete Category',
                description: 'Transaction deleted successfully'
            });
        } catch (error) {
            console.error('Failed to delete Transaction:', error);

            notification.error({
                message: 'Failed to Delete Transaction',
                description: 'Failed to delete Transaction. Please try again.'
            });
        }
    };


    const handleSearch = async (value) => {
        setSearchedText(value.toLowerCase());
        try {
            const response = await invoke('find_all_transaction', { token });
            const filteredData = response.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setDataSource(filteredData);
        } catch (error) {
            console.error('Failed to fetch Transaction:', error);
        }
    };

    const resetSearch = async () => {
        setSearchedText('');
        try {
            const response = await invoke('find_all_transaction', { token });
            setDataSource(response);
        } catch (error) {
            console.error('Failed to fetch Transaction:', error);
        }
    };

    const columns = [
        {
          title: 'Transaction ID',
          dataIndex: 'transaction_id',
          key: 'transaction_id',
        },
        {
          title: 'User ID',
          dataIndex: 'user_id',
          key: 'user_id',
        },
        {
          title: 'Account Name',
          dataIndex: 'account_name',
          key: 'account_name',
        },
        {
          title: 'Transaction Date',
          dataIndex: 'transaction_date',
          key: 'transaction_date',
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Transaction Type',
          dataIndex: 'transaction_type',
          key: 'transaction_type',
          render: (text, record) => {
            let buttonStyle = {}; 
          
            switch (text) {
              case 'income':
                buttonStyle = { backgroundColor: '#52c41a', borderColor: '#52c41a', color: '#fff' };
                break;
              case 'expense':
                buttonStyle = { backgroundColor: '#f5222d', borderColor: '#f5222d', color: '#fff' };
                break;
              case 'transfer':
                buttonStyle = { backgroundColor: '#faad14', borderColor: '#faad14', color: '#000' };
                break;
              default:
                break;
            }
          
            return (
              <Button shape="rounded" style={buttonStyle}>{text}</Button>
            );
          }
        },
        {
          title: 'Category Name',
          dataIndex: 'category_name',
          key: 'category_name',
        },
        {
          title: 'Location',
          dataIndex: 'location',
          key: 'location',
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
                <Link to={`/admin/transaction/edit/${record.transaction_id}`}>
                    <Button type='primary'>Update</Button>
                </Link>
                <Button type='primary' onClick={() => handleDelete(record.transaction_id)} danger>Delete</Button>
            </div>
        ),
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await invoke('find_all_transaction', { token });
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
            <Card title="Table Transaction">
                <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Col span={8}>
                        <Link to={"/admin/transaction/add"}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </Link>

                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Search
                            placeholder="Search Transaction"
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

export default TransactionList;
