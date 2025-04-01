import axios from 'axios'
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

    const [data, setData] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()

    let API = 'http://localhost:3700/api/'

    const handleChange = (e) => {
        const { name, value } = e.target
        // console.log(name);
        // console.log(value);

        setData((prev) => ({
            ...prev, [name]: value
        }))
    }

    // console.log(data);

    const handleSignUp = async () => {
        // console.log("**********");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            alert("Please enter a valid Email address!");
            return;
        }

        try {
            let response = await axios.post(`${API}signUpDetail`, data)
            // console.log(response.data.message);

            alert(response.data.message)
            // console.log(response, "handleSignUp SUCCESS");

            setData({
                email: "",
                password: "",
            })

            navigate('/Login')

        } catch (error) {
            // console.log(error, "handleSignUp FAIL");
            if (error.response) {
                alert(error.response.data.message)
            } else {
                alert("Something went Wrong")
            }
            // alert(response.data.message)
        }
    }

    const signnUpToLogin = async () => {
        navigate('/login')
        alert("Redirecting to LOGIN!")
        return
    }


    return (
        <div
            style={{
                backgroundImage: `url('/matrix-blue.webp')`,
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
                        <h3 className="mb-4">Create an Account</h3>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    name='email'
                                    placeholder="Enter your E-mail"
                                    value={data.email}
                                    onChange={handleChange}
                                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                    className='w-75'
                                    autoFocus
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name='password'
                                    placeholder="Enter your Password"
                                    value={data.password}
                                    onChange={handleChange}
                                    className='w-75'
                                />
                            </Form.Group>
                            <Button onClick={handleSignUp} variant='dark'>Sign-Up</Button>
                            <h6 className='mt-2 mb-0'>Already have an account ?<Button onClick={signnUpToLogin} variant='transparent' className='mb-1'>Login</Button></h6>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default Signup;