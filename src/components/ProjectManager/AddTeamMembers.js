import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom'; 
import '../../styles/ProjectManager/AddTeamMembers.css';

const AddTeamMembers = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [teamMembers, setTeamMembers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch team members
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get('https://revtaskman-bgf0cwfaaxg9b5e8.southindia-01.azurewebsites.net/users/team-members');
                const memberOptions = response.data.map(member => ({
                    value: member.userid,
                    label: member.username,
                }));
                setTeamMembers(memberOptions);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        // Fetch projects based on username
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`https://revtaskman-bgf0cwfaaxg9b5e8.southindia-01.azurewebsites.net/projects/by-username?username=${username}`);
                const projectOptions = response.data.map(project => ({
                    value: project.projectId,
                    label: project.projectName,
                }));
                setProjects(projectOptions);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchTeamMembers();
        fetchProjects();
    }, [username]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedTeamMember && selectedProject) {
            try {
                const response = await axios.put(`https://revtaskman-bgf0cwfaaxg9b5e8.southindia-01.azurewebsites.net/projects/${selectedProject.value}/add-team-member/${selectedTeamMember.value}`, null, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    alert(`Team Member ${selectedTeamMember.label} has been added to ${projects.find(project => project.value === selectedProject.value).label}!`);
                    setSelectedTeamMember(null);
                    setSelectedProject(null);
                } else {
                    alert('Failed to add team member to project. Please try again.');
                }
            } catch (error) {
                console.error('Error adding team member to project:', error);
                alert('An error occurred while adding team member to project. Please try again.');
            }
        } else {
            alert('Please select both a team member and a project.');
        }
    };

    return (
        <div className="atm-container">
            <h1 className="atm-title">Add Team Members to Project</h1>
            <form id="addTeamMemberForm" className="atm-form" onSubmit={handleSubmit}>
                <div className="atm-form-group">
                    <label className="atm-label" htmlFor="project">Select Project</label>
                    <Select
                        id="project"
                        name="project"
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={projects}
                        placeholder="Select a project"
                        className="atm-select"
                        isClearable
                        required
                    />
                </div>
                <div className="atm-form-group">
                    <label className="atm-label" htmlFor="teamMember">Select Team Member</label>
                    <Select
                        id="teamMember"
                        name="teamMember"
                        value={selectedTeamMember}
                        onChange={setSelectedTeamMember}
                        options={teamMembers}
                        placeholder="Select a team member"
                        className="atm-select"
                        isClearable
                        required
                    />
                </div>
                <button type="submit" className="atm-submit-button">Add Team Member</button>
            </form>
            {message && <p className="atm-message">{message}</p>}
        </div>
    );
};

export default AddTeamMembers;
