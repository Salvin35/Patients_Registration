import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import imageSrc from './aa.jpg'

function UserForm({ onSubmit, initialValues }) {
    const [user, setUser] = useState(initialValues || {});
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    useEffect(() => {
        getMethod();    
    }, []);

    const getMethod = () => {
        axios.get('http://localhost:5000/users/')
            .then(response => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const deleteUser = (userId) => {
        axios.delete(`http://localhost:5000/users/${userId}`)
            .then(response => {
                console.log('User deleted:', response.data);
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const updateUser = (userId, newData) => {
        axios.put(`http://localhost:5000/users/${userId}`, newData)
            .then(response => {
                console.log('User updated:', response.data);
                const updatedUser = response.data;
                setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
                setEditMode(false);
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    };

    const populateForm = (userId) => {
        const userData = users.find(user => user._id === userId);
        setUser(userData);
        setEditingUserId(userId);
        setEditMode(true);
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            updateUser(editingUserId, user);
        } else {
            const response = await axios.post('http://localhost:5000/users/add', user);
            console.log('user --> ', response);
            setUser({});
            getMethod();
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateUser(editingUserId, user);
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', backgroundColor: "#0C505A", color: 'white', paddingInline: '2em' }}>REGISTER  <img title="my-img" src={imageSrc} alt="my-img" /> </h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={user.firstName || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={user.lastName || ''} onChange={handleChange} required />
                </div>
                <div>
                    <label>Gender:</label>
                    <select name="gender" value={user.gender || ''} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="dob" value={user.dob || ''} onChange={handleChange} required />
                </div>
                {editMode ? (
                    <button type="submit" onClick={handleEditSubmit}>Save</button>
                ) : (
                    <button type="submit">Submit</button>
                )}
            </form>
            <hr style={{ width: '50em', marginTop: '2.5em', color: 'black' }}></hr>
            <h2 style={{ textAlign: 'center' }}>All Patients Data</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>First Name</th>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>Last Name</th>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>Gender</th>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>Date of Birth</th>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>Delete</th>
                        <th style={{ border: '1px solid #dddddd', backgroundColor: '#0C505A', textAlign: 'left', padding: '8px' }}>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.firstName}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.lastName}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{user.gender}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>{new Date(user.dob).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px', width: '2em' }}>
                                <button className="udl" onClick={() => deleteUser(user._id)}>Delete</button>
                            </td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px', width: '2em' }}>
                                <button className="udl" onClick={() => populateForm(user._id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserForm;