import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import imageSrc from './aa.jpg';

function UserForm({ onSubmit, initialValues }) {
    const [user, setUser] = useState(initialValues || {});   
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedFirstName, setEditedFirstName] = useState('');
    const [editedLastName, setEditedLastName] = useState('');
    const [editedGender, setEditedGender] = useState('');
    const [editedDob, setEditedDob] = useState('');

    useEffect(() => {
        getMethod();    
    }, []);

    const getMethod = () => {
        axios.get('http://localhost:5000/users/')
            .then(response => {
                const filteredUsers = response.data.filter(user => user.firstName && user.lastName && user.gender && user.dob);
                setUsers(filteredUsers);
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

    const updateUser = async (userId, newData) => {
        // Format the date to "yyyy-MM-dd" before updating
        const formattedDate = newData.dob.split('T')[0];
        try {
            const response = await axios.put(`http://localhost:5000/users/${userId}`, { ...newData, dob: formattedDate });
            console.log('User updated:', response.data);
            const updatedUser = response.data;
            setUsers(users.map(user => (user._id === userId ? updatedUser : user)));
            setEditMode(false);
            setUser({}); // Clear the form after saving
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleFirstNameChange = (e) => {
        setEditedFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setEditedLastName(e.target.value);
    };

    const handleGenderChange = (e) => {
        setEditedGender(e.target.value);
    };

    const handleDobChange = (e) => {
        setEditedDob(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
            // Format the date to "yyyy-MM-dd" before adding a new user
            const formattedDate = user.dob.split('T')[0];
            axios.post('http://localhost:5000/users/add', { ...user, dob: formattedDate })
                .then(response => {
                    console.log('user --> ', response);
                    setUser({}); // Clear the form after saving
                    getMethod();
                })
                .catch(error => {
                    console.error('Error adding user:', error);
                });
        }
    

    const populateForm = (userId, firstName, lastName, gender, dob) => {
        const userData = users.find(user => user._id === userId);
        // Format the date to "yyyy-MM-dd" before populating the form
        if (userData) {
            const formattedDate = userData.dob.split('T')[0];
            setUser({ ...userData, dob: formattedDate });
            setUser({});
            setEditedFirstName(firstName);
            setEditedLastName(lastName);
            setEditedGender(gender);
            setEditedDob(dob);
            alert(dob)
            setEditingUserId(userId);
            setEditMode(true);
        } else {
            console.error('User not found');
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', backgroundColor: "#0C505A", color: 'white', paddingInline: '2em' }}>REGISTER  <img title="my-img" src={imageSrc} alt="my-img" /> </h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={user.firstName || ''} onChange={handleChange} required placeholder='Enter First name'/>
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={user.lastName || ''} onChange={handleChange} required placeholder='Enter Last name'/>
                </div>
                <div>
                    <label>Gender:</label>
                    <select name="gender"  value={user.gender || ''} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="dob" value={user.dob || ''} onChange={handleChange} required />
                </div>
                    <button type="submit">Submit</button>
            </form>
            <hr style={{ width: '50em', marginTop: '2.5em', color: 'black' }}></hr>
            <h2 style={{ textAlign: 'center' }}>All Patients Data</h2>
            <table style={{ width: '100%', border:'5px solid black' }}>
                <thead>
                    <tr style={{border:'2px solid black'}}>
                        <th style={{ borderBottom: '3px solid black',borderRight: '3px solid black', backgroundColor: '#B7D7DC', textAlign: 'left', padding: '8px' }}>First Name</th>
                        <th style={{ borderBottom: '3px solid black',borderRight: '3px solid black', backgroundColor: '#B7D7DC', textAlign: 'left', padding: '8px' }}>Last Name</th>
                        <th style={{ borderBottom: '3px solid black',borderRight: '3px solid black', backgroundColor: '#B7D7DC', textAlign: 'left', padding: '8px' }}>Gender</th>
                        <th style={{ borderBottom: '3px solid black',borderRight: '3px solid black',backgroundColor: '#B7D7DC', textAlign: 'left', padding: '8px' }}>Date of Birth</th>
                        <th style={{ borderBottom: '3px solid black',borderRight: '3px solid black', backgroundColor: '#B7D7DC', textAlign: 'left', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                {editMode && editingUserId === user._id ? (
                                    <input type="text" value={editedFirstName} onChange={handleFirstNameChange} />
                                ) : (
                                    user.firstName
                                )}
                            </td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                {editMode && editingUserId === user._id ? (
                                    <input type="text" value={editedLastName} onChange={handleLastNameChange} />
                                ) : (
                                    user.lastName
                                )}
                            </td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
                                {editMode && editingUserId === user._id ? (
                                    <select value={editedGender} onChange={handleGenderChange}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                ) : (
                                    user.gender
                                )}
                            </td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>
    {editMode && editingUserId === user._id ? (
        <input type="date"  value={editedDob}  onChange={handleDobChange} required 
        />
    ) : (
      user.dob ? new Date(user.dob).toLocaleDateString() : ''
    )}
</td>
                            <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px', width:'10%' }}>
                                {editMode && editingUserId === user._id ? (
                                    <button style={{backgroundColor:'#0C505A', width:'50%'}} onClick={() => updateUser(user._id, { ...user, firstName: editedFirstName, lastName: editedLastName, gender: editedGender, dob: editedDob })}>Done</button>
                                ) : (
                                    <button style={{backgroundColor:'#128807', width:'50%'}} className='udl' onClick={() => populateForm(user._id, user.firstName, user.lastName, user.gender, user.dob.split('T')[0])}>Edit</button> 
                                )}
                                <button style={{backgroundColor:'red', width:'50%',marginTop:'10px'}} onClick={() => deleteUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserForm;
