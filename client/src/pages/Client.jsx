import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from 'axios';
import { MdDelete, MdIncompleteCircle } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Client = () => {

    let API = "http://localhost:3700/api/";

    const [task, setTask] = useState({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0], // Default to today's date
        priorityLevel: "low",
        completed: ""
    });

    const [viewTasks, setViewTasks] = useState([]);
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const [newStatus, setNewStatus] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const completed = async (stat, UID) => {
        setSelectedTaskId(UID);
        setNewStatus(stat);
        setShow(true);
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(null);
    const [newText, setNewText] = useState("");

    const handleEdit = async (id, des) => {
        setIsEditing(true);
        setEditDescription(id);
        setNewText(des)
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [taskToDelete, setTaskToDelete] = useState(null);

    const [filterPriority, setFilterPriority] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDueDate, setFilterDueDate] = useState("");

    const [sortOrder, setSortOrder] = useState("asc");

    const [selectedTasks, setSelectedTasks] = useState([]);

    const taskChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value);

        setTask((prev) => ({
            ...prev, [name]: value
        }));
    };

    const taskChangeComp = (e) => {
        setTask((prev) => ({
            ...prev,
            [e.target.name]: e.target.value === "true" ? true : false,
        }));
    };

    const taskAdd = async () => {

        if (task.title.trim() === "" || task.description.trim() === "" ||
            task.priorityLevel.trim() === "" || task.dueDate.trim() === "") {
            alert("All fields required!");
            return;
        };

        const today = new Date().toISOString().split("T")[0];
        if (task.dueDate < today) {
            alert("Due date cannot be in the past!");
            return;
        }

        try {

            let payload = {
                ...task,
                completed: Boolean(task.completed),
            };

            let response = await axios.post(`${API}postTask`, payload, {
                headers: { "Content-Type": "application/json" }
            });
            alert(response.data.message);
            // console.log(response, "taskAdd RESPONSE");

            getTasks();
        } catch (error) {
            // alert(response.data.message)
            // if (error.response) {
            //     alert(error.response.data.message)
            // } else {
            //     alert("i don't know")
            // }
            alert(error.response?.data?.message || "Unknown error");
            // console.log(error, "ERROR in AddTASK");
        }
    };

    const getTasks = async () => {
        try {
            let response = await axios.get(`${API}getTasks`);
            setViewTasks(response.data)
        } catch (error) {
            console.log(error);
        }
    };

    const taskDelete = async (UID) => { 
        try {
            let response = await axios.delete(`${API}deleteTask/?id=${UID}`);
            // console.log(response, "taskDelete RESPONSE");
            // alert(response.data.message)
            getTasks();
        } catch (error) {
            console.log(error, "taskDelete ERROR");
        }
    };

    const taskLogout = async () => {
        localStorage.removeItem('token');
        navigate('/login');
        alert('LOGGED OUT!');
        return;
    };

    const taskStatus = async () => {
        try {
            let response = await axios.put(`${API}statusUpdation/?id=${selectedTaskId}`, { newStatus });
            console.log(response, "taskStatus RESPONSE");
            setShow(false);
            getTasks();
        } catch (error) {
            console.log(error, "taskStatus ERROR");
        }
    };

    const editTaskDes = async (id, newText) => {
        try {
            setIsEditing(false)
            setEditDescription(null)
            let response = await axios.put(`${API}editTaskDes`, { id: id, newText: newText })
            getTasks()
            console.log(response, "responseeeeeeeeee");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelect = (id) => {
        setSelectedTasks((prev) =>
            prev.includes(id)
                ? prev.filter((taskId) => taskId !== id)
                : [...prev, id]
        );
    };

    const markSelected = async (status) => {
        try {
            await axios.put(`${API}bulkStatusUpdate`, {
                ids: selectedTasks,
                newStatus: status
            });
            setSelectedTasks([]);
            getTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSelected = async () => {
        try {
            await axios.post(`${API}bulkDelete`, {
                ids: selectedTasks
            });
            setSelectedTasks([]);
            getTasks();
        } catch (error) {
            console.log(error);
        }
    };

    // console.log(viewTasks);

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-center align-items-center h-100vh" style={{
                backgroundImage: `url('/purple-abstract.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minWidth: '100vw',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            >
                <Container className="p-4 border border-secondary shadow-lg">
                    <Row>

                        <Col md={6} className='p-4 border border-dark text-light'>
                            <h3 className='mb-4'>Task Management</h3>
                            <Form>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your Title"
                                        name='title'
                                        value={task.title}
                                        onChange={taskChange}
                                        autoFocus
                                    />
                                </Form.Group>

                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows={3}
                                        type='text'
                                        name='description'
                                        value={task.description}
                                        onChange={taskChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Priority Level</Form.Label>
                                    <Form.Select
                                        name='priorityLevel'
                                        value={task.priorityLevel}
                                        onChange={taskChange}
                                    >
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name='dueDate'
                                        min={new Date().toISOString().split("T")[0]} // Restrict past dates
                                        value={task.dueDate}
                                        // value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                                        onChange={taskChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Completion Status</Form.Label>
                                    <Form.Select
                                        name='completed'
                                        value={task.completed ? "true" : "false"}
                                        // value={task.completed.toString()}
                                        onChange={taskChangeComp}
                                    >
                                        <option value="true">Completed</option>
                                        <option value="false">Pending</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button onClick={taskAdd} variant='outline-light' className='m-1'>Add TASK</Button>
                                <Button onClick={taskLogout} variant='outline-light' className='m-1'>Logout</Button>

                            </Form>
                        </Col>

                        <Col md={6} className="p-4 border border-dark text-light">

                            {/* <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="mb-3" style={{ maxWidth: "200px" }}> */}
                            {/* <option value="asc">Sort by Due Date: Ascending</option>
  <option value="desc">Sort by Due Date: Descending</option>
</Form.Select> */}

                            <h3 className="mb-4">Task Filtering <Button variant="outline-light" onClick={() => {
                                setFilterPriority("");
                                setFilterStatus("");
                                setFilterDueDate("");
                            }}>
                                Clear Filters
                            </Button></h3>
                            <Form className="mb-3 d-flex gap-3 flex-wrap">

                                {/* Priority Filter */}
                                <Form.Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                                    <option value="">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </Form.Select>

                                {/* Completion Status Filter */}
                                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="">All Status</option>
                                    <option value="true">Completed</option>
                                    <option value="false">Pending</option>
                                </Form.Select>

                                {/* Due Date Filter */}
                                <Form.Select value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)}>
                                    <option value="">All Dates</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                </Form.Select>

                            </Form>

                            <h3 className="mb-4">Task's <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} variant="outline-light">
                                Sorted by Due Date: {sortOrder === "asc" ? "Ascending" : "Descending"}
                            </Button></h3>
                            <div className="d-flex flex-column justify-content-center">
                                {viewTasks
                                    .filter((task) => {
                                        const matchPriority = filterPriority ? task.priorityLevel === filterPriority : true;
                                        const matchStatus = filterStatus !== "" ? String(task.completed) === filterStatus : true;

                                        // Due Date Filtering Logic
                                        const taskDate = new Date(task.dueDate);
                                        const today = new Date();
                                        const startOfWeek = new Date(today);
                                        startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week
                                        const endOfWeek = new Date(startOfWeek);
                                        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week
                                        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                                        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                                        let matchDueDate = true;
                                        if (filterDueDate === "today") {
                                            matchDueDate = taskDate.toDateString() === today.toDateString();
                                        } else if (filterDueDate === "week") {
                                            matchDueDate = taskDate >= startOfWeek && taskDate <= endOfWeek;
                                        } else if (filterDueDate === "month") {
                                            matchDueDate = taskDate >= startOfMonth && taskDate <= endOfMonth;
                                        }

                                        return matchPriority && matchStatus && matchDueDate;
                                    })

                                    .sort((a, b) => {
                                        const dateA = new Date(a.dueDate);
                                        const dateB = new Date(b.dueDate);
                                        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
                                    })

                                    .map((task, index) => (
                                        <div key={index} className="align-items-center mb-3 border p-2">



                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedTasks.includes(task._id)}
                                                    onChange={() => handleSelect(task._id)}
                                                    className="me-2"
                                                />
                                                <h5 className="m-1">{task.title}</h5>

                                                {selectedTasks.length > 0 && (
                                                    <div>
                                                        <Button variant="warning" onClick={() => markSelected(false)} className="me-2">
                                                            Mark as Pending
                                                        </Button>
                                                        <Button variant="success" onClick={() => markSelected(true)} className="me-2">
                                                            Mark as Completed
                                                        </Button>
                                                        <Button variant="danger" onClick={deleteSelected}>
                                                            Delete Selected
                                                        </Button>
                                                    </div>
                                                )}

                                            </div>

                                            <span className="m-1" style={{
                                                maxWidth: "300px",
                                                overflowWrap: "break-word",
                                                wordBreak: "break-word",
                                                whiteSpace: "pre-wrap",
                                                // padding: "8px",
                                            }}>{task.description}
                                            </span>

                                            <span>
                                                {editDescription !== task._id ? (
                                                    // <Button onClick={() => handleEdit(task._id, task.description)}></Button>
                                                    < BiSolidEditAlt className='m-1 mt-0'
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleEdit(task._id, task.description)} />

                                                ) : (
                                                    <>
                                                        <input type="text" value={newText}
                                                            style={{
                                                                width: "100%",
                                                                maxWidth: "100%",           // stay within parent
                                                                height: "100px",            // adjustable
                                                                resize: "none",             // optional
                                                                overflowWrap: "break-word", // break long words
                                                                wordBreak: "break-word",
                                                                whiteSpace: "pre-wrap",     // handle line breaks
                                                                padding: "8px",
                                                                boxSizing: "border-box",
                                                                fontSize: "14px"
                                                            }}
                                                            onChange={(e) => setNewText(e.target.value)} placeholder='Edit Text' />
                                                        <Button onClick={() => setEditDescription(null)} variant='secondary'>Cancel</Button>
                                                        <Button onClick={() => editTaskDes(task._id, newText)} variant='primary'>Save</Button>
                                                    </>
                                                )}
                                            </span>
                                            <p className='m-1 text-white'>Priority : {task.priorityLevel}</p>
                                            <p className={`m-1 ${task.completed ? 'text-success' : 'text-danger'}`} >
                                                {task.completed ? "Completed" : "Pending"}
                                                {/* {task.completed === true || task.completed === "true" ? "Completed" : "Pending"} */}
                                                < MdIncompleteCircle className='m-1 mt-0'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => completed(task.completed, task._id)} />
                                            </p>
                                            {/* <p className="m-1 text-muted small">{task.dueDate}</p> */}
                                            {<p className="m-1 text-info">DueDate : {task.dueDate.split("T")[0]}</p>}

                                            <MdDelete onClick={() => {
                                                // taskDelete(task._id);
                                                setShowDeleteModal(true);
                                            }}
                                                style={{ cursor: "pointer", width: '20px', height: '20px' }} />

                                            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Confirm Delete</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    Are you sure you want to delete this task?
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => {
                                                            taskDelete(task._id);
                                                            // taskDelete(taskToDelete);
                                                            setShowDeleteModal(false);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>


                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Task Status</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                            {/* <Form.Label>Email address</Form.Label> */}
                                                            <Form.Select
                                                                name="completed"
                                                                value={newStatus}
                                                                onChange={(e) => setNewStatus(e.target.value)}
                                                            >
                                                                <option value="true">Completed</option>
                                                                <option value="false">Pending</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                    <Button variant="primary" onClick={() => taskStatus(task._id)}>
                                                        Done
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    ))}
                            </div>
                        </Col>

                    </Row>
                </Container>
            </div>
        </>
    )
};

export default Client;