import React, { useState } from 'react';
import { Layout, theme } from 'antd';

import Sidebar from './Sidebar';
import Headers from './Header';
import AuthProvider from '../provider/auth';


const LayoutAdmin = ({ children }) => {
    const { Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [loading, setLoading] = useState(true);

    return (
        <AuthProvider>

            <Layout >
                <Sidebar collapsed={collapsed} colorBgContainer={colorBgContainer} />
                <Layout>
                    <Headers collapsed={collapsed} setCollapsed={setCollapsed} colorBgContainer={colorBgContainer} />
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 'calc(100vh - 112px)',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </AuthProvider>

    );
};

export default LayoutAdmin;
