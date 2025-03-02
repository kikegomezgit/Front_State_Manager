"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Divider, Button, Timeline, Drawer, Card, Space, Skeleton } from "antd";
import { JsonViewer } from "@textea/json-viewer";
import {
    EyeOutlined,
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";

const colorMap = {
    pending: "#faad14",  // Yellow
    completed: "#52c41a",  // Green
    failed: "#ff4d4f",  // Red
};

const iconMap = {
    pending: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    completed: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    failed: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
};

const Page = ({ params }) => {
    const { id, workflow } = params;
    const [timeline, setTimeline] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const orderRef = useRef(null);

    const onClose = () => {
        setVisible(false);
    };

    const showDrawer = useCallback((e) => {
        const origin = e.currentTarget.id;
        const _setJson =
            origin === "order"
                ? orderData?.order
                : orderRef.current?.steps.find((step) => step.step_name === origin) || {};
        setJsonData(_setJson);
        setVisible(true);
    }, [orderData]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.API_ORDERS_HOST}/order?order_id=${id}&workflow=${workflow}`,
                    {
                        headers: {
                            restapitoken: process.env.SECRET_API_TOKEN,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await response.json();
                const _timeline = data?.steps?.map((step) => ({
                    label: (
                        <div style={{ fontSize: "16px", color: "black" }}>
                            {step?.end_time || ""}
                        </div>
                    ),
                    children: (
                        <div style={{ fontSize: "16px", color: "black" }}>
                            <span
                                onClick={showDrawer}
                                style={{ cursor: "pointer" }}
                                id={step?.step_name}
                            >
                                <Space size="middle">
                                    <Button>
                                        <EyeOutlined /> Details
                                    </Button>
                                </Space>
                            </span>{" "}
                            {step?.step_name}
                        </div>
                    ),
                    color: colorMap[step?.status],
                    dot: (
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                                backgroundColor: "#f5f5f5",
                                border: `1px solid ${colorMap[step?.status] || "#ccc"}`,
                            }}
                        >
                            {iconMap[step?.status] || <ClockCircleOutlined />}
                        </div>
                    ),
                }));

                setIsPending(data?.status === "pending");
                setTimeline(_timeline);
                setOrderData(data);
                orderRef.current = data; // Save the order in a ref for future use
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]); // Only trigger when `id` changes

    return (
        <>
            <Button onClick={() => router.back()}>
                <ArrowLeftOutlined />
                Back
            </Button>
            <Card style={{ padding: '10px', marginTop: '25px' }}>
                {loading ? (
                    <Skeleton active />
                ) : (
                    <>
                        <h1> {id}{" "}
                            <span onClick={showDrawer} id="order" style={{ cursor: "pointer" }}>
                                <Space size="middle">
                                    <Button>
                                        <EyeOutlined /> Details
                                    </Button>
                                </Space>
                            </span>
                        </h1>
                        <Divider />
                        <Timeline
                            style={{ fontSize: "40px" }}
                            mode="right"
                            items={timeline}
                            pending={isPending}
                        />
                        <Drawer
                            title={jsonData?.step_name || jsonData?.order_id}
                            placement="right"
                            onClose={onClose}
                            open={visible}
                            width={500}
                            style={{ overflow: "auto", background: '#F5F7F8' }}
                        >
                            <Card style={{ width: "100%", marginTop: 20 }}>
                                {jsonData ? (
                                    <JsonViewer value={jsonData} />
                                ) : (
                                    <p>Loading JSON data...</p>
                                )}
                            </Card>
                        </Drawer>
                    </>
                )}
            </Card>
        </>
    );
};

export default Page;
