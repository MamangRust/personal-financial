// ContentSection.js
import React from 'react';
import { Row, Col } from 'antd';
import ReactApexChart from 'react-apexcharts';

const ContentSection = ({ barChartData, pieChartData }) => {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title="Bar Chart"
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
        >
          <ReactApexChart
            options={barChartData.options}
            series={barChartData.series}
            type="bar"
            height={350}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="Pie Chart"
          bordered={false}
          style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
        >
          <ReactApexChart
            options={pieChartData.options}
            series={pieChartData.series}
            type="pie"
            height={350}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ContentSection;
