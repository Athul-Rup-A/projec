import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });

    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
    const [passwordChangeError, setPasswordChangeError] = useState('');

    let API = "http://localhost:3700/api/";

    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                // console.log("Token sent in request:", token);

                const res = await axios.get(`${API}user-profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // console.log("Profile data received:", res.data);
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || ''
                });

            } catch (error) {
                // console.error('Error fetching profile');
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };

        const fetchProfileAndStats = async () => {
            try {
                const token = localStorage.getItem('token');

                const [profileRes, statsRes] = await Promise.all([
                    axios.get(`${API}user-profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API}task-stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setProfile({
                    name: profileRes.data.name || '',
                    email: profileRes.data.email || '',
                    phone: profileRes.data.phone || ''
                });

                setStats(statsRes.data);
            } catch (error) {
                console.error('Error fetching profile or stats:', error);
            }
        };


        fetchProfile();
        fetchProfileAndStats();
    }, []);

    const handlePasswordChange = async () => {
        const { currentPassword, newPassword, confirmPassword } = password;
        // console.log('Password Data:', password); 

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }

        if (newPassword.length < 6 || confirmPassword.length < 6) {
            alert('New password and confirm password must be at least 6 characters.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            // console.log('Token:', token);
            const res = await axios.put(`${API}change-password`,
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert('Password updated successfully!');

            setPassword({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })

        } catch (error) {
            // console.error(error); 
            alert(error.response?.data?.message || 'Error changing password.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API}user-profile`, profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profile Updated!");
            setProfile(res.data)
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating profile');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100vh" style={{
            backgroundImage: `url('/1600.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minWidth: '100vw',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}
        >
            <Container className="mt-5 text-light">

                <Row>

                    <Col md={4} className='p-4 text-light'>

                        <h2>User Profile</h2>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" className='w-50' value={profile.email} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className='w-50'
                                    value={profile.name || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    className='w-50'
                                    value={profile.phone || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </Form.Group>


                            {isEditing ? (
                                <Button variant="outline-light" onClick={handleUpdate}>Save</Button>
                            ) : (
                                <Button variant="outline-light" onClick={() => setIsEditing(true)}>Edit</Button>
                            )}
                        </Form>
                    </Col>

                    <Col md={4} className='p-4 text-light'>

                        <div>

                            <h2 className="mb-3">Change Password</h2>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="currentPassword"
                                        className='w-50'
                                        value={password.currentPassword}
                                        onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        className='w-50'
                                        value={password.newPassword}
                                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        className='w-50'
                                        value={password.confirmPassword}
                                        onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                                    />
                                </Form.Group>

                                <Button variant="outline-light" onClick={handlePasswordChange}>Change Password</Button>
                            </Form>
                        </div>
                    </Col>
                    <Col md={4} className='p-4 text-light'>

                        <h2 className='mb-3'>Task Statistics</h2>
                        <p><strong>Total Tasks:</strong> {stats.total}</p>
                        <p><strong>Completed Tasks:</strong> {stats.completed}</p>
                        <p><strong>Overdue Tasks:</strong> {stats.overdue}</p>

                        <Link to="/client">
                            <Button variant="outline-light">back</Button>
                        </Link>

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
