"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Divider, Button, Modal, Skeleton, Checkbox, Input, Select } from 'antd';
import { ArrowLeftOutlined, CloseCircleOutlined } from '@ant-design/icons';
import OrdersTable from '@/app/components/OrdersTable';
import styles from '../../styles.module.css';

const { Option } = Select;

const OrdersPage = ({ selectedWorkflow }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [ordersToReprocess, setOrdersToReprocess] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalOrders, setTotalOrders] = useState(0);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [prevQuery, setPrevQuery] = useState(null);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false); // to disable the input after search
    const [activeFilter, setActiveFilter] = useState("all");

    const filters = [
        { label: "All", value: "all", color: "#1890ff" },       // Blue
        { label: "Failed", value: "failed", color: "#ff4d4f" }, // Red
        { label: "Completed", value: "completed", color: "#52c41a" }, // Green
        { label: "Pending", value: "pending", color: "#faad14" }, // Orange
        { label: "In Progress", value: "in_progress", color: "#722ed1" } // Purple
    ];

    useEffect(() => {
        setIsSearchDisabled(false);
        setSearchQuery("");
        const fetchOrders = async () => {
            try {
                let url = `${process.env.API_ORDERS_HOST}/orders?pageSize=${pageSize}&page=${currentPage}&workflow=${selectedWorkflow}`;
                if (filterStatus !== "all") {
                    url += `&status=${filterStatus}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'restapitoken': process.env.SECRET_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await response.json();
                const ordersFormat = data?.orders?.map(order => ({
                    key: order._id,
                    order_id: order.order_id,
                    status: order.status,
                    start_date: order.F_start_time,
                    finish_date: order.F_end_time,
                    workflow: order.workflow,
                    reprocessed: order.reprocessed
                }));

                setOrders(ordersFormat);
                setTotalOrders(data.totalOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedWorkflow) {
            setLoading(true);
            fetchOrders();
        }
    }, [selectedWorkflow, currentPage, filterStatus, pageSize]);

    if (error) return <p>Error: {error}</p>;

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(value);
    };

    const fetchReprocessableOrders = async () => {
        try {
            const response = await fetch(`${process.env.API_ORDERS_HOST}/orders?workflow=${selectedWorkflow}&notReprocessed=true&status=failed&pageSize=all`, {
                headers: {
                    'restapitoken': process.env.SECRET_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch reprocessable orders");
            }

            const data = await response.json();
            const formattedOrders = data.orders.map(order => ({
                key: order._id,
                order_id: order.order_id,
                finish_date: order.F_start_time,
                selected: true // ✅ Checked by default
            }));

            setOrdersToReprocess(formattedOrders);
            // console.log(formattedOrders)
            setIsModalVisible(true);
        } catch (error) {
            console.error(error);
        }
    };
    const handleReprocess = async () => {
        const selectedOrders = ordersToReprocess.filter(order => order.selected).map(order => order.order_id);

        if (selectedOrders.length === 0) {
            alert("No orders selected for reprocessing.");
            return;
        }

        try {
            const response = await fetch(`${process.env.API_ORDERS_HOST}/reprocess`, {
                method: 'POST',
                headers: {
                    'webhookapitoken': process.env.SECRET_WEBHOOK_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orders: selectedOrders,
                    workflow: selectedWorkflow
                })
            });

            if (!response.ok) {
                throw new Error("Failed to reprocess orders");
            }

            setIsModalVisible(false);
            setTimeout(() => location.reload(), 3000);
        } catch (error) {
            console.error(error);
        }
    };
    // ✅ Toggle order selection
    const toggleOrderSelection = (order_id) => {
        setOrdersToReprocess(prevOrders =>
            prevOrders.map(order =>
                order.order_id === order_id ? { ...order, selected: !order.selected } : order
            )
        );
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearchDisabled(true); // Disable input while searching
        setPrevQuery({ currentPage, filterStatus });
        setCurrentPage(1);

        try {
            // const response = await fetch(`${process.env.API_ORDERS_HOST}/order?order_id=${searchQuery}&workflow=${selectedWorkflow}`, {
            const response = await fetch(`${process.env.API_ORDERS_HOST}/orders?pageSize=50&page=1&workflow=${selectedWorkflow}&search=${searchQuery}`, {
                headers: {
                    'restapitoken': process.env.SECRET_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Order not found");
            }

            const data = await response.json();
            const ordersFormat = data?.orders?.map(order => ({
                key: order._id,
                order_id: order.order_id,
                status: order.status,
                start_date: order.F_start_time,
                finish_date: order.F_end_time,
                workflow: order.workflow,
                reprocessed: order.reprocessed
            }));

            setOrders(ordersFormat);
            setTotalOrders(data.totalOrders);
        } catch (error) {
            console.error(error);
            setOrders([]);
            setTotalOrders(0);
        }
    };

    const handleClearSearch = async () => {
        setSearchQuery("");
        setIsSearchDisabled(false); // Enable input when clearing search

        if (prevQuery) {
            setCurrentPage(prevQuery.currentPage);
            setFilterStatus(prevQuery.filterStatus);
            setPrevQuery(null);
        }

        try {
            let url = `${process.env.API_ORDERS_HOST}/orders?pageSize=${pageSize}&page=${currentPage}&workflow=${selectedWorkflow}`;
            if (filterStatus !== "all") {
                url += `&status=${filterStatus}`;
            }

            const response = await fetch(url, {
                headers: {
                    'restapitoken': process.env.SECRET_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }

            const data = await response.json();
            const ordersFormat = data?.orders?.map(order => ({
                key: order._id,
                order_id: order.order_id,
                status: order.status,
                start_date: order.F_start_time,
                finish_date: order.F_end_time,
                workflow: order.workflow,
                reprocessed: order.reprocessed
            }));

            setOrders(ordersFormat);
            setTotalOrders(data.totalOrders);
        } catch (error) {
            console.error(error);
            setOrders([]);
            setTotalOrders(0);
        }
    };
    const handleFilterChange = (value) => {
        setActiveFilter(value);
        setFilterStatus(value);
        setCurrentPage(1)
    };
    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: 'center' }}>

                <h1>{selectedWorkflow}</h1>
                {/* Search Bar */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                        placeholder="Search order by ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isSearchDisabled} // Disable input when searching
                        style={{ width: "80%", height: "32px" }}
                        addonAfter={
                            searchQuery && (
                                <CloseCircleOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleClearSearch}
                                />
                            )
                        }
                    />
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>
            <Divider />

            {/* Search Bar & Filter Dropdown */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                    <Button onClick={fetchReprocessableOrders} style={{ background: '#722ed1', color: 'white' }}>
                        Reprocess FAILED orders
                    </Button>
                </div>
                <div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {filters.map(({ label, value, color }) => (
                            <Button
                                key={value}
                                size="small"
                                disabled={isSearchDisabled}
                                style={{
                                    backgroundColor: activeFilter === value ? color : "#f0f0f0",
                                    color: activeFilter === value ? "#fff" : "#000",
                                    borderColor: activeFilter === value ? color : "#d9d9d9"
                                }}
                                onClick={() => handleFilterChange(value)}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>



            {/* ✅ Modal for selecting reprocessable orders */}
            <Modal
                title="Confirm Reprocess"
                open={isModalVisible}
                onOk={handleReprocess}
                style={{
                    top: 500,
                }}
                onCancel={() => setIsModalVisible(false)}
                okText="Confirm"
                cancelText="Cancel"
            >
                <p>Select orders to reprocess:</p>
                <ul>
                    {ordersToReprocess.map(order => (
                        <li key={order.key} style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                checked={order.selected}
                                onChange={() => toggleOrderSelection(order.order_id)}
                            />
                            <span style={{ marginLeft: '10px' }}>
                                {order.order_id} -  {order.finish_date}
                            </span>
                        </li>
                    ))}
                </ul>
            </Modal>

            <Divider />
            <Select defaultValue={15} onChange={handlePageSizeChange} style={{ width: 120, marginBottom: 10 }}>
                <Option value={15}>15 / page</Option>
                <Option value={40}>40 / page</Option>
                <Option value={80}>80 / page</Option>
            </Select>

            {loading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
                <OrdersTable
                    orders={orders}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalOrders={totalOrders}
                    onOrdersChange={setOrdersToReprocess}
                    onPageChange={handlePageChange}
                />
            )}

        </div>
    );
};

export default OrdersPage;
