import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    let API = 'http://localhost:3700/api/';

    const loginChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);

        setData((prev) => ({
            ...prev, [name]: value
        }));
    };

    const handleLogin = async () => {
        // console.log("**********");

        if (!data.email || !data.password) {
            alert("Email and Password are required!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert("Please enter a valid Email!");
            return;
        }

        try {
            let response = await axios.post(`${API}loginDetail`, data);
            // console.log(response, "handleLogin SUCCESS");
            alert(response.data.message);
            localStorage.setItem("token", response.data.token);

            setData({
                email: "",
                password: "",
            });

            navigate('/client');

        } catch (error) {
            // console.log(error, "handleLogin FAIL");
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went Wrong");
            }
        }
    };

    const handleRegister = async () => {
        navigate('/')
        return
    };

    // console.log(data);

    return (
        <div
            style={{
                backgroundImage: `url('/matrix-purple.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >

            <Container className="mt-5">
                <Row className='d-flex flex-column justify-content-center align-items-center'>
                    <Col md={5} className="p-4 border border-dark bg-white bg-opacity-75 rounded">
                        <h3 className="mb-4">Welcome Back,</h3>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    name='email'
                                    placeholder="Enter your User E-mail"
                                    value={data.email}
                                    onChange={loginChange}
                                    className='w-75'
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name='password'
                                    placeholder="Enter your User Password"
                                    value={data.password}
                                    onChange={loginChange}
                                    className='w-75'
                                />
                            </Form.Group>
                            <Button onClick={handleLogin} variant='dark' className='m-1'>User Login</Button>
                            <h6 className='mt-2'>Don't have an account ?<Button onClick={handleRegister} variant='transparent' className='mb-1'>Sign Up</Button></h6>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default Login;