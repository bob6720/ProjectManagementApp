import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    //States to use
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
	const [sortColumn, setSortColumn] = useState('');


    //Gets the Projects
    const handleGetProjects = async () => {
        try {
            const response = await axios.get('http://localhost:3000/projects');
            console.log('API response:', response);
            const data = Array.isArray(response.data) ? response.data : [];
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    //Deletes the Project via the ID.
    const handleDeleteProject = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/projects/${id}`);
            console.log(`Project with ID ${id} deleted`);
            setProjects(projects.filter(project => project.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    //Sorts the projects, ascending or descending
    const handleSortProjects = (column) => {
		let newOrder = 'asc';
		if (sortColumn === column && sortOrder === 'asc') {
			newOrder = 'desc';
		}

		const sorted = [...projects].sort((a, b) => {
			const valA = a[column]?.toString().toLowerCase() ?? '';
			const valB = b[column]?.toString().toLowerCase() ?? '';

			if (column.toLowerCase().includes('date')) {
				return newOrder === 'asc'
					? new Date(valA) - new Date(valB)
					: new Date(valB) - new Date(valA);
			}

			return newOrder === 'asc'
				? valA.localeCompare(valB)
				: valB.localeCompare(valA);
		});

		setProjects(sorted);
		setSortColumn(column);
		setSortOrder(newOrder);
	};


    //Searching the projects via name
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    //Searching the projects cont
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //Return code for displaying all the projects, search bar, and sorting button.
    return (
        <div className="app">
            <div>
                <h1>Projects</h1>
                <button onClick={handleGetProjects}>Get Projects</button>
            </div>
            <input
                type="text"
                placeholder="Search projects by name"
                value={searchQuery}
                onChange={handleSearch}
            />
            {projects.length > 0 ? (
                filteredProjects.length > 0 ? (
                    <table className="project-table">
                        <thead>
                            <th onClick={() => handleSortProjects('id')} style={{ cursor: 'pointer' }}>
							  ID {sortColumn === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
							</th>
							<th onClick={() => handleSortProjects('name')} style={{ cursor: 'pointer' }}>
							  Name {sortColumn === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
							</th>
							<th onClick={() => handleSortProjects('description')} style={{ cursor: 'pointer' }}>
							  Description {sortColumn === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
							</th>
							<th onClick={() => handleSortProjects('startdate')} style={{ cursor: 'pointer' }}>
							  Start Date {sortColumn === 'startdate' && (sortOrder === 'asc' ? '↑' : '↓')}
							</th>
							<th onClick={() => handleSortProjects('enddate')} style={{ cursor: 'pointer' }}>
							  End Date {sortColumn === 'enddate' && (sortOrder === 'asc' ? '↑' : '↓')}
							</th>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project.id}>
                                    <td>{project.id}</td>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>{project.startdate}</td>
                                    <td>{project.enddate}</td>
                                    <td>
                                        <button onClick={() => handleDeleteProject(project.id)} className="button-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No projects found. Please try a different search query.</p>
                )
            ) : (
                <p>No projects available. Please click "Get Projects" to fetch the projects.</p>
            )}
        </div>
    );
};

//Export
export default App;
