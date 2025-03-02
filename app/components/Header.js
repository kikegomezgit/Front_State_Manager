import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, theme, Menu, Dropdown, Avatar } from 'antd';
import { useAuth } from "../context/AuthContext";
import styles from '../../styles.module.css'
import { DownOutlined } from '@ant-design/icons';
const { Header: Antd_Header, Content } = Layout;

const Header = ({ toggleCollapse, collapsed }) => {

    const { user, logout } = useAuth()
    const menuItems = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: logout,
        },
    ];
    const menu = (
        <Menu
            items={menuItems}
            onClick={({ key }) => {
                const selectedItem = menuItems.find(item => item.key === key);
                selectedItem?.onClick();
            }}
        />
    );

    return (
        !user ? <></> :
            <Antd_Header
                style={{
                    padding: 0,
                    background: '#384B70',
                    marginBottom: '10px'
                }}
            >
                <div className={styles.headerBox}>
                    <div>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '24px' }} /> : <MenuFoldOutlined style={{ fontSize: '24px' }} />}
                            onClick={() => toggleCollapse()}

                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'end' }}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Avatar
                                style={{
                                    backgroundColor: 'purple',
                                    verticalAlign: 'middle',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                                size='large'>
                                {user.name}
                            </Avatar>
                        </Dropdown>
                    </div>
                </div>

            </Antd_Header>
    )
}

export default Header