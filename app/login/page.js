"use client";
import { useState, useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "./../context/AuthContext"; // Import the AuthContext

export default function LoginPage() {
    const router = useRouter();
    const { login, user } = useAuth(); // Get the login function from context
    const [loading, setLoading] = useState(false);

    // Handle user redirection after the component has mounted
    // useEffect(() => {
    //     if (user) {
    //         router.push("/state_machines");
    //     }
    // }, [user, router]);

    const onFinish = (values) => {
        const { email, password } = values;

        setLoading(true);

        // Mock authentication
        if (email === "admin@example.com" && password === "password") {
            message.success("Login successful!");

            // Simulate login by setting user data
            login({ email, name: "Admin" });

            setTimeout(() => {
                setLoading(false);
                router.push("/");
            }, 1000);
        } else {
            message.error("Invalid email or password");
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error("Please check the form fields");
    };

    return (
        <div style={styles.container}>
            <div>
                <Card style={{ marginBottom: '25px' }}>

                    <p> email: admin@example.com</p>
                    <p> password: password</p>
                </Card>
                <Form
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    style={styles.form}
                    layout="vertical"
                >
                    <h1 style={styles.heading}>Login</h1>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                        {/* admin@example.com */}
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                        {/* password */}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
    },
    form: {
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        width: "300px",
    },
    heading: {
        marginBottom: "20px",
        textAlign: "center",
    },
};