import { useRouter } from 'next/navigation';
import {
    UserOutlined,
    ApartmentOutlined,
} from '@ant-design/icons';
import { Layout, Menu, } from 'antd';
const { Header, Sider: Antd_Sider, Content } = Layout;


const Sider = ({ collapsed }) => {
    const buttonStyle = {
        cursor: 'pointer',
        color: 'black',
    };
    const items = [
        {
            type: "group",
            label: "Monitoring",
            children: [
                {
                    key: 'd/dashboard',
                    icon: <UserOutlined />,
                    label: <span style={buttonStyle}>Dashboard</span>,
                },
            ],
        },
        {
            type: "group",
            label: "Management",
            children: [
                {
                    key: '/',
                    icon: <ApartmentOutlined />,
                    label: <span style={buttonStyle}>State Workflows</span>,
                }
            ],
        },
    ];

    const router = useRouter();

    const handleMenuClick = ({ key }) => {
        router.push(`/${key}`)
    };

    return (
        <Antd_Sider trigger={null} collapsible collapsed={collapsed} style={{ background: 'white' }}>
            <div className="demo-logo-vertical" style={{ marginTop: '150px' }} />
            <Menu
                style={{ fontSize: '16px' }}
                mode="inline"
                onClick={handleMenuClick}
                defaultSelectedKeys={['1']}
                items={items}
            />
        </Antd_Sider>

    )
}

export default Sider

