import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/manageContest.css';

const ManageContest = () => {
    const [requestedContests, setRequestedContests] = useState([]);
    const [approvedContests, setApprovedContests] = useState([]);
    const [view, setView] = useState('requested');

    useEffect(() => {
        fetchRequestedContests();
        fetchApprovedContests();
    }, []);

    const fetchRequestedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/requested_contest');
            setRequestedContests(response.data);
        } catch (error) {
            console.error('Error fetching requested contests', error);
        }
    };

    const fetchApprovedContests = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/approved_contests');
            setApprovedContests(response.data);
        } catch (error) {
            console.error('Error fetching approved contests', error);
        }
    };

    const approveContest = async (contest) => {
        try {
            await axios.post('http://localhost:8000/api/approved_contests', contest);
            await axios.delete(`http://localhost:8000/api/requested_contests/delete/${contest._id}`);
            fetchRequestedContests();
            fetchApprovedContests();
        } catch (error) {
            console.error('Error approving contest', error);
        }
    };

    const deleteContest = async (id) => {
        try {
            // console.log(id);
            await axios.delete(`http://localhost:8000/api/requested_contest/delete/${id}`);
            fetchRequestedContests();
        } catch (error) {
            console.error('Error deleting contest', error);
        }
    };

    return (
        <div className="manageContest-container">
            <div className="manageContest-button-container">
                <button onClick={() => setView('requested')}>Requested Contests</button>
                <button onClick={() => setView('approved')}>Approved Contests</button>
            </div>
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
                                    <td>{contest.author}</td>
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
                                    <td>{contest.author}</td>
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
