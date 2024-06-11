import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/manageContest.css';

const ManageContest = ({ admin }) => {
    const [requestedContests, setRequestedContests] = useState([]);
    const [approvedContests, setApprovedContests] = useState([]);
    const [view, setView] = useState('requested');
    const [error, setError] = useState('');
    const [approving, setApproving] = useState(false); // Track if approval is in progress

    useEffect(() => {
        fetchRequestedContests();
        fetchApprovedContests();
    }, []);

    const fetchRequestedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/requested_contest');
            setRequestedContests(response.data);
        } catch (error) {
            showError('Error fetching requested contests');
        }
    };

    const fetchApprovedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/approved_contest');
            setApprovedContests(response.data);
        } catch (error) {
            showError('Error fetching approved contests');
        }
    };

    const approveContest = async (contest) => {
        if (approving) return; // Prevent multiple executions
        setApproving(true);
        try {
            console.log('Contest: ' ,contest);
            const approvedContest = {
                ...contest,
                approvedBy: {
                    adminName: admin.username,
                    adminEmail: admin.email
                },
                approvalTime: new Date()
            };

            console.log('Approved: ',approvedContest);

            const [createResponse, deleteResponse] = await Promise.all([
                axios.post('http://localhost:8000/api/approved_contest/create', approvedContest),
                axios.delete(`http://localhost:8000/api/requested_contest/delete/${contest.cid}`)
            ]);

            if (createResponse.status === 201 && deleteResponse.status === 200) {
                fetchRequestedContests();
                fetchApprovedContests();
            } else {
                showError('Error approving contest');
            }
        } catch (error) {
            showError('Error approving contest');
        } finally {
            setApproving(false);
        }
    };

    const deleteContest = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/requested_contest/delete/${id}`);
            fetchRequestedContests();
        } catch (error) {
            showError('Error deleting contest');
        }
    };

    const showError = (message) => {
        setError(message);
    };

    const closeError = () => {
        setError('');
    };

    const filteredApprovedContests = approvedContests.filter(
        contest => contest.approvedBy && contest.approvedBy.adminName === admin.username
    );

    return (
        <div className="manageContest-container">
            <div className="manageContest-button-container">
                <button onClick={() => setView('requested')}>Requested Contests</button>
                <button onClick={() => setView('approved')}>Approved Contests</button>
            </div>
            {error && (
                <div className="error-popup">
                    <div className="error-popup-content">
                        <span className="close-button" onClick={closeError}>&times;</span>
                        {error}
                    </div>
                </div>
            )}
            {view === 'requested' && (
                <div className="manageContest-table-container">
                    <h2>Requested Contests</h2>
                    <table className="manageContest-contest-table">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestedContests.map((contest, index) => (
                                <tr key={contest._id}>
                                    <td>{index + 1}</td>
                                    <td>{contest.title}</td>
                                    <td>{contest.author ? contest.author.authorName : 'Unknown'}</td>
                                    <td>
                                        <button onClick={() => approveContest(contest)} disabled={approving}>Approve</button>
                                        <button onClick={() => deleteContest(contest.cid)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {view === 'approved' && (
                <div className="manageContest-table-container">
                    <h2>Approved Contests</h2>
                    <table className="manageContest-contest-table">
                        <thead>
                            <tr>
                                <th>Serial No</th>
                                <th>Title</th>
                                <th>Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApprovedContests.map((contest, index) => (
                                <tr key={contest._id}>
                                    <td>{index + 1}</td>
                                    <td>{contest.title}</td>
                                    <td>{contest.author ? contest.author.authorName : 'Unknown'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageContest;
