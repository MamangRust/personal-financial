import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Col, Divider, Input, Row, Table, notification } from 'antd';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';

const GoalListPage = () => {
    const { Search } = Input;

    const [searchedText, setSearchedText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const { token, setToken } = useAuthStore()


    const handleDelete = async (id) => {
        try {
            const response = await invoke('delete_goal', { token, goalId: id });
            console.log('Goal deleted:', response);

            const newData = dataSource.filter(goal => goal.goal_id !== id);
            setDataSource(newData);

            notification.info({
                message: 'Delete Goal',
                description: 'Goal deleted successfully'
            });
        } catch (error) {
            console.error('Failed to delete Goal:', error);

            notification.error({
                message: 'Failed to Delete Goal',
                description: 'Failed to delete Goal. Please try again.'
            });
        }
    };

    const handleSearch = async (value) => {
        setSearchedText(value.toLowerCase());
        try {
            const response = await invoke('find_all_goals', { token });
            const filteredData = response.filter((item) =>
                item.goal_name.toLowerCase().includes(value.toLowerCase())
            );
            setDataSource(filteredData);
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        }
    };

    const resetSearch = async () => {
        setSearchedText('');
        try {
            const response = await invoke('find_all_goals', { token });
            setDataSource(response);
        } catch (error) {
            console.error('Failed to fetch goals:', error);
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'goal_id',
            key: 'goal_id',
        },
        {
            title: 'Name',
            dataIndex: 'goal_name',
            key: 'goal_name',
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
            title: "Current Amount",
            dataIndex: "current_amount",
            key: 'current_amount',
        },
        {
            title: "Target Amount",
            dataIndex: "target_amount",
            key: 'target_amount',
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
                <Link to={`/admin/goal/edit/${record.goal_id}`}>
                    <Button type='primary'>Update</Button>
                </Link>
                <Button type='primary' onClick={() => handleDelete(record.goal_id)} danger>Delete</Button>
            </div>
        ),
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await invoke("find_all_goals", { token });


                setDataSource(response)
            } catch (err) {
                
                console.log("Failed to fetch goals: ", err)
            }
        }

        fetchData()
    }, [])

    const updatedColumns = [...columns, actionColumn];

    return (
        <div>
            <Card title="Table Goals">
                <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Col span={8}>
                        <Link to={"/admin/goal/add"}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Add
                            </Button>
                        </Link>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Search
                            placeholder="Search Goal"
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

export default GoalListPage;
