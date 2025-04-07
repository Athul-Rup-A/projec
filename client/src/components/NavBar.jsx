import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/TaskNavbar.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const NavBar = ({ onLogout }) => {
    return (
        <Navbar bg="" variant="light" expand="lg" className="custom-navbar p-0">
            <Container>
                <Navbar.Brand as={Link} to="/">Task Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="ms-auto d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-2">
                        <Button as={Link} to="/profile" variant="primary" className="custom-button">
                            Profile
                        </Button>
                        <Button variant="danger" onClick={onLogout} className="custom-button">
                            Logout
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;