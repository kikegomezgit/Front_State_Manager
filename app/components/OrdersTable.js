import { CheckCircleOutlined, RetweetOutlined, CloseCircleOutlined, VerticalAlignBottomOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Table, Space, Tag, Card } from 'antd';
import { useRouter, usePathname } from "next/navigation";
import styles from '../../styles.module.css'

const OrdersTable = ({ orders, currentPage, pageSize, totalOrders, onOrdersChange, onPageChange }) => {
    const router = useRouter();
    const pathname = usePathname();
    const colors = {
        'completed': 'green',
        'pending': 'yellow',
        'failed': 'red'
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'order_id',
            key: 'id',
            color: 'blue',
            render: (text, record) => (
                <Space>
                    {record.status === 'completed' && (
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    )}
                    {record.status === 'pending' && (
                        <RetweetOutlined style={{ color: 'gold' }} />
                    )}
                    {record.status === 'in_progress' && (
                        <VerticalAlignBottomOutlined style={{ color: 'blue' }} />
                    )}
                    {record.status === 'failed' && (
                        <CloseCircleOutlined style={{ color: 'red' }} />
                    )}
                    {record.reprocessed === true && (
                        <RetweetOutlined style={{ color: 'purple' }} />
                    )}
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <span>
                    <Tag className={styles.tag}
                        color={colors[status]}
                        key={status}>

                        {status.toUpperCase()}
                    </Tag>
                </span>
            ),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            responsive: ['lg']
        },
        {
            title: 'Finish Date',
            dataIndex: 'finish_date',
            responsive: ['lg']
        },
        {
            title: '',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">

                    <Button type="dashed" onClick={() => router.push(`${pathname}/${record.workflow}/${record.order_id}`)}>
                        <EyeOutlined />Details
                    </Button>

                </Space>
            ),
        },
    ];
    // const rowSelection = {
    //     onChange: (selectedRowKeys, selectedRows) => {
    //         onOrdersChange(selectedRows.map(order => order.order_id))
    //     },
    //     getCheckboxProps: (record) => ({
    //         disabled: record.status === 'completed' || record.status === 'in_progress' || record.status === 'pending' || record.reprocessed === true
    //     }),
    // };

    return (
        <Card style={{ boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.2)' }}>
            <Table
                // rowSelection={{
                //     ...rowSelection,
                // }}
                scroll={{ y: 500 }}
                columns={columns}
                dataSource={orders}
                bordered={true}

                pagination={{
                    current: currentPage,
                    pageSize,
                    total: totalOrders,
                    onChange: onPageChange,
                }}
                rowClassName={() => styles.greenRow}
            />
        </Card>

    )
}

export default OrdersTable