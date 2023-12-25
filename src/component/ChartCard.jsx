// ChartCard.js
import React from 'react';
import { Col, Card } from 'antd';

const ChartCard = ({ title, icon, value }) => {
  return (
    <Col span={8}>
      <Card title={title} bordered={false} style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
        {icon} {/* Icon */}
        {value}
      </Card>
    </Col>
  );
};

export default ChartCard;
