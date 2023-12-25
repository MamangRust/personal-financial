import React, { useEffect, useState } from 'react';
import {
  DollarOutlined,
} from '@ant-design/icons';
import { Row, Col, Card, Table, Button, Typography, Flex, Spin } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { invoke } from '@tauri-apps/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';




const Home = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { Text } = Typography

  const [loading, setLoading] = useState(true)

  const { token, setToken } = useAuthStore();

  const [yearlyRevenue, setYearlyRevenue] = useState([]);

  const [budgetTotal, setBudgetTotal] = useState(null);
  const [goalTotal, setGoalTotal] = useState(null);
  const [transactionTotal, setTransactionTotal] = useState(null);


  const [chartData, setChartData] = useState({
    options: {},
    series: {}
  });

  const [dataSource, setDataSource] = useState([]);



  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setLoading(true)


    const fetchData = async () => {
      try {
        await invoke("find_all_transaction", { token }).then((data) => {

          console.log("Hello Transaction: ", JSON.stringify(data))
          setDataSource(data);
        })

        setLoading(false)


      } catch (err) {
        
        console.log("Failed to fetch Category: ", err);
      }
    };

    const fetchPieChart = async () => {
      try {
        const response = await invoke("get_categories_with_transaction_counts", { token });

        const categories = response.map((item) => item.category_name);
        const totalTransactions = response.map((item) => item.total_transactions);


        setChartData({
          options: {
            chart: {
              type: 'pie'
            },
            labels: categories
          },
          series: totalTransactions
        })

        setLoading(false)

      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    const fetchYearlyRevenue = async () => {
      try {
        const response = await invoke("calculate_yearly_revenue", { token });
        setYearlyRevenue(response);

        setLoading(false)

      } catch (err) {
        console.error("Error fetching yearly revenue:", err);
      }
    };

    const fetchSumSummary = async () => {
      try {

        const budgetResponse = await invoke("sum_budget", { token });
        const goalResponse = await invoke("sum_goal", { token });
        const transactionResponse = await invoke("sum_transaction", { token });

        setBudgetTotal(budgetResponse);
        setGoalTotal(goalResponse);
        setTransactionTotal(transactionResponse)


        setLoading(false)

      } catch (error) {
        console.error('Error fetching budget and goal summary:', error);
      }
    };


    fetchSumSummary();
    fetchYearlyRevenue()
    fetchData();
    fetchPieChart();
  }, []);

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




  const isMobile = windowSize.width < 768;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const chartDataYear = {
    series: [{
      name: 'Yearly Revenue',
      data: Object.keys(yearlyRevenue).map(month => yearlyRevenue[month] || 0),
    }],
    options: {
      chart: {
        id: 'barChart',
        toolbar: {
          show: !isMobile,
        },
      },
      xaxis: {
        categories: months,
      },
    },
  };



  return (
    <div>
      {loading ? (
        <Flex align="center" gap="middle">
          
          <Spin size="large" />
        </Flex>
      ) : (

        <div>
          <Row gutter={16} style={{ marginBottom: '16px' }}>
            <Col span={8}>
              <Card title="Goal" bordered={false} style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <DollarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <Text type="secondary" style={{ fontSize: '1.5em' }}>{goalTotal}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Budget" bordered={false} style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <DollarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <Text type="secondary" style={{ fontSize: '1.5em' }}>{budgetTotal}</Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Transaction" bordered={false} style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <DollarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <Text type="secondary" style={{ fontSize: '1.5em' }}>{transactionTotal}</Text>
              </Card>
            </Col>
          </Row>
          <div style={{ marginBottom: '16px' }}></div>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Bar Chart"
                bordered={false}
                style={{
                  borderRadius: 8,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  height: isMobile ? '400px' : '430px',
                }}
              >
                <ReactApexChart
                  options={chartDataYear.options}
                  series={chartDataYear.series}
                  type="bar"
                  height={isMobile ? 250 : 300} />

              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="Pie Chart"
                bordered={false}
                style={{
                  borderRadius: 8,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  height: isMobile ? '400px' : '430px',
                }}
              >
                <ReactApexChart
                  options={chartData.options}
                  series={chartData.series}
                  type="pie"
                  height={isMobile ? 250 : 300}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Card
                title="Transfer History"
                bordered={false}
                style={{
                  borderRadius: 8,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  marginTop: '16px',
                }}
              >
                <Table dataSource={dataSource} columns={columns} />
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>

  );
};

export default Home;
