import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import '../../styles/ProjectManager/TrackUserActivityProject.css';

const TrackUserActivityPage = () => {
    const location = useLocation();
    const { username } = location.state || {};
    const [teamMembers, setTeamMembers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(`https://revtaskman-bgf0cwfaaxg9b5e8.southindia-01.azurewebsites.net/users/team-members-by-manager?managerName=${username}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const memberOptions = data.map(member => ({
                    value: member.username,
                    label: member.username,
                }));
                setTeamMembers(memberOptions);
            } catch (error) {
                console.error('Error fetching team members:', error);
            }
        };

        if (username) {
            fetchTeamMembers();
        }
    }, [username]);

    const handleTrack = async () => {
        if (selectedUser) {
            try {
                const response = await fetch(`https://revtaskman-bgf0cwfaaxg9b5e8.southindia-01.azurewebsites.net/tasks/by-username/${selectedUser.value}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching user activities:', error);
            }
        }
    };

    return (
        <div id="track-activity-container">
            <h1 id="track-activity-title">Track User Activity</h1>
            <div id="track-form-group">
                <label htmlFor="userSelect" id="track-label">Select User</label>
                <Select
                    id="userSelect"
                    value={selectedUser}
                    onChange={setSelectedUser}
                    options={teamMembers}
                    placeholder="Select a user"
                    isClearable
                />
                <button id="trackButton" onClick={handleTrack}>Track</button>
            </div>
            <div id="activityContainer">
                {activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={index} className="track-activity-card">
                            {/* Project Details */}
                            <h3 className="card-title">Project: {activity.project.projectName}</h3>
                            <p><strong>Description:</strong> {activity.project.projectDetails}</p>
                            {/* Task Details */}
                            <h3 className="task-title">Task: {activity.taskName}</h3>
                            <p className="task-details"><strong>Task Description:</strong> {activity.taskDetails}</p>
                            <p className="task-details"><strong>Start Date:</strong> {new Date(activity.startDate).toLocaleDateString()}</p>
                            <p className="task-details"><strong>Due Date:</strong> {new Date(activity.dueDate).toLocaleDateString()}</p>
                            {/* Milestone Details */}
                            <h4 className="milestone-title">Milestone: {activity.milestone.milestoneName}</h4>
                            <p className="milestone-details">{activity.milestone.milestoneDescription}</p>
                        </div>
                    ))
                ) : (
                    <p>Select User to display activity</p>
                )}
            </div>
        </div>
    );
};

export default TrackUserActivityPage;
