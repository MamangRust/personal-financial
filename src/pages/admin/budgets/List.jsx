import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const BudgetListPage = () => {
    const { Search } = Input;

    const [searchedText, setSearchedText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const {token, setToken} = useAuthStore();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await invoke("find_all_budget", { token });
                setDataSource(response)
            } catch (err) {
                
                console.log("Failed to fetch budget: ", err)
            }
        }

        fetchData()
    }, [])


    const handleDelete = async (id) => {
        try {
            const response = await invoke('delete_budget', { token, budgetId: id });
            console.log('Budget deleted:', response);

            const newData = dataSource.filter(budget => budget.budget_id !== id);
            setDataSource(newData);

            notification.info({
                message: 'Delete Budget',
                description: 'Budget deleted successfully'
            });
        } catch (error) {
            console.error('Failed to delete Budget:', error);

            notification.error({
                message: 'Failed to Delete Budget',
                description: 'Failed to delete Budget. Please try again.'
            });
        }
    };

    const handleSearch = async (value) => {
        setSearchedText(value.toLowerCase());
        try {
            const response = await invoke('find_all_budget', { token });
            const filteredData = response.filter((item) =>
                item.budget_id.toString().includes(value.toLowerCase()) ||
                item.user_id.toString().includes(value.toLowerCase()) ||
                item.category_name.toString().includes(value.toLowerCase()) ||
                item.amount.toString().includes(value.toLowerCase()) ||
                (item.start_date && item.start_date.toString().includes(value.toLowerCase())) ||
                (item.end_date && item.end_date.toString().includes(value.toLowerCase())) ||
                (item.created_at && item.created_at.toString().includes(value.toLowerCase())) ||
                (item.updated_at && item.updated_at.toString().includes(value.toLowerCase()))
            );
            setDataSource(filteredData);
        } catch (error) {
            console.error('Failed to fetch budget:', error);
        }
    };
    

    const resetSearch = async () => {
        setSearchedText('');
        try {
            const response = await invoke('find_all_budget', { token });
            setDataSource(response);
        } catch (error) {
            console.error('Failed to fetch budget:', error);
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'budget_id',
            key: 'budget_id',
        },
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
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
                <Link to={`/admin/budget/edit/${record.budget_id}`}>
                    <Button type='primary'>Update</Button>
                </Link>
                <Button type='primary' onClick={() => handleDelete(record.budget_id)} danger>Delete</Button>
            </div>
        ),
    };

    

    const updatedColumns = [...columns, actionColumn];

    return (
        <div>
            <Card title="Table Budget">
                <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Col span={8}>
                        <Link to={"/admin/budget/add"}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </Link>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Search
                            placeholder="Search Budget"
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

export default BudgetListPage;
