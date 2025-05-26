import React, { useState } from 'react';
import axios from 'axios';
import './CreateProject.css';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startdate, setStartdate] = useState('');
    const [enddate, setEnddate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(enddate) < new Date(startdate)) {
            setError('End date must be equal to or later than the start date.');
            return;
        }
        setError('');
        const formattedStartdate = formatDateTime(startdate);
        const formattedEnddate = formatDateTime(enddate);

        try {
            const newProject = { name, description, startdate: formattedStartdate, enddate: formattedEnddate };
            await axios.post('http://localhost:3000/projects', newProject);
            alert('Project created successfully!');
            setName('');
            setDescription('');
            setStartdate('');
            setEnddate('');
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        }
    };

    const formatDateTime = (dateTime) => dateTime.replace('T', ' ');

    return (
        <div className="create-project-app">
            <h1>Create New Project</h1>
            <form onSubmit={handleSubmit} className="project-form">
                <div className={`fade-section ${name.length >= 0 ? 'visible' : ''}`}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {name && (
                    <div className="fade-section visible">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                )}

                {description && (
                    <div className="fade-section visible">
                        <label>Start Date:</label>
                        <input
                            type="datetime-local"
                            value={startdate}
                            onChange={(e) => setStartdate(e.target.value)}
                            required
                        />
                    </div>
                )}

                {startdate && (
                    <div className="fade-section visible">
                        <label>End Date:</label>
                        <input
                            type="datetime-local"
                            value={enddate}
                            onChange={(e) => setEnddate(e.target.value)}
                            required
                        />
                    </div>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {enddate && (
                    <button type="submit">Submit</button>
                )}
            </form>
        </div>
    );
};

export default CreateProject;
