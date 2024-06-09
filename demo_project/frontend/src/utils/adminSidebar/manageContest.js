import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/manageContest.css';

const ManageContest = ({ admin }) => {
    const [requestedContests, setRequestedContests] = useState([]);
    const [approvedContests, setApprovedContests] = useState([]);
    const [view, setView] = useState('requested');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequestedContests();
        fetchApprovedContests();
    }, []);

    const fetchRequestedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/requested_contest');
            setRequestedContests(response.data);
        } catch (error) {
            setError('Error fetching requested contests');
            console.error('Error fetching requested contests', error);
        }
    };

    const fetchApprovedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/approved_contest');
            setApprovedContests(response.data);
        } catch (error) {
            setError('Error fetching approved contests');
            console.error('Error fetching approved contests', error);
        }
    };

    const approveContest = async (contest) => {
        try {
            const approvedContest = {
                ...contest,
                approvedBy: {
                    adminName: admin.username,
                    adminEmail: admin.email
                },
                approvalTime: new Date()
            };

            console.log(approveContest);

            await axios.post('http://localhost:8000/api/approved_contest/create', approvedContest);
            await axios.delete(`http://localhost:8000/api/requested_contest/delete/${contest.cid}`);
            fetchRequestedContests();
            fetchApprovedContests();
        } catch (error) {
            setError('Error approving contest');
            console.error('Error approving contest', error);
        }
    };

    const deleteContest = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/requested_contest/delete/${id}`);
            fetchRequestedContests();
        } catch (error) {
            setError('Error deleting contest');
            console.error('Error deleting contest', error);
        }
    };

    return (
        <div className="manageContest-container">
            <div className="manageContest-button-container">
                <button onClick={() => setView('requested')}>Requested Contests</button>
                <button onClick={() => setView('approved')}>Approved Contests</button>
            </div>
            {error && <div className="error-message">{error}</div>}
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
                                        <button onClick={() => approveContest(contest)}>Approve</button>
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
                            {approvedContests.map((contest, index) => (
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
