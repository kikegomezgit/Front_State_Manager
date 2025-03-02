"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./../context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, Skeleton } from "antd";
import OrdersPage from "./../components/OrdersPage";
import styles from "./../../styles.module.css";

const WorkflowSelector = () => {
    const router = useRouter();
    const { redirectToLoginOnNoSession } = useAuth();
    const [menuCards, setMenuCards] = useState([]);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        redirectToLoginOnNoSession();

        const fetchMenuCards = async () => {
            try {
                const response = await fetch(`${process.env.API_ORDERS_HOST}/workflows`, {
                    headers: {
                        restapitoken: process.env.SECRET_API_TOKEN,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch workflows");
                }

                const data = await response.json();
                const formattedMenuCards = data.map((workflow, index) => ({
                    name: workflow,
                    key: index,
                }));

                setMenuCards(formattedMenuCards);

                if (formattedMenuCards.length > 0) {
                    setSelectedWorkflow(formattedMenuCards[0].name);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuCards();
    }, []);

    return (

        <div>
            <Card>

                {/* <div style={{ padding: '10px' }}>workflows</div> */}
                <div className={styles.cardContainer}>
                    {loading
                        ? Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton.Button
                                key={index}
                                active
                                size="large"
                                shape="default"
                                className={styles.skeletonCard}
                            />
                        ))
                        : menuCards.map((card) => (
                            <Card
                                key={card.key}
                                onClick={() => setSelectedWorkflow(card.name)}
                                className={`${styles.cards} ${selectedWorkflow === card.name ? styles.selectedCard : ""
                                    }`}
                            >
                                <p>{card.name}</p>
                            </Card>
                        ))}
                </div>

                {selectedWorkflow && <OrdersPage selectedWorkflow={selectedWorkflow} style={{ overflow: 'auto' }} />}
            </Card>

        </div>)
};

export default WorkflowSelector;
