import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js';
import 'chartjs-chart-radial-gauge';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './styles/UserProfile.css';

const UserProfile = ({ contestant }) => {
    const { username } = contestant;
    const [profileData, setProfileData] = useState(null);
    const radialGaugeRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/profile_decore/user-profile/${username}`)
            .then(response => {
                console.log('response', response.data);
                setProfileData(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile data:', error);
            });
    }, [username]);

    useEffect(() => {
        if (profileData && radialGaugeRef.current && barChartRef.current) {
            const { totalSubmittedProblems, totalSolvedProblems } = profileData;
            const solvedPercentage = (totalSolvedProblems / totalSubmittedProblems) * 100;

            // Radial Gauge Chart
            new Chart(radialGaugeRef.current, {
                type: 'radialGauge',
                data: {
                    labels: ['Solved'],
                    datasets: [{
                        data: [solvedPercentage],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    }],
                },
                options: {
                    responsive: true,
                    legend: { display: false },
                    centerPercentage: 80,
                    trackColor: 'rgba(54, 162, 235, 0.2)',
                },
            });

            // Bar Chart
            new Chart(barChartRef.current, {
                type: 'bar',
                data: {
                    labels: ['Total Submitted Problems', 'Total Solved Problems'],
                    datasets: [{
                        label: 'Problems',
                        data: [totalSubmittedProblems, totalSolvedProblems],
                        backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)'],
                    }],
                },
                options: {
                    responsive: true,
                    legend: { display: false },
                    scales: {
                        yAxes: [{
                            ticks: { beginAtZero: true }
                        }]
                    }
                }
            });
        }
    }, [profileData]);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    const { submissionActivity } = profileData;

    return (
        <div className="user-profile">
            <h1 className="profile-heading">User Profile</h1>
            <div className="profile-section">
                <h2 className="section-heading">Performance Overview</h2>
                <div className="chart-container">
                    <div className="radial-gauge-container">
                        <h3 className="chart-heading">Solved Problems Percentage</h3>
                        <canvas ref={radialGaugeRef} />
                    </div>
                    <div className="bar-chart-container">
                        <h3 className="chart-heading">Total Problems Overview</h3>
                        <canvas ref={barChartRef} />
                    </div>
                </div>
            </div>
            <div className="profile-section">
                <h2 className="section-heading">Submission Activity</h2>
                <div className="heatmap-calendar-container">
                    <h3 className="chart-heading">Yearly Submission Heatmap</h3>
                    <CalendarHeatmap
                        startDate={new Date('2024-01-01')}
                        endDate={new Date('2024-12-31')}
                        values={Object.keys(submissionActivity).map(date => ({
                            date,
                            count: submissionActivity[date].solved,
                        }))}
                        classForValue={(value) => {
                            if (!value) {
                                return 'color-empty';
                            } else if (value.count <= 3) {
                                return 'color-scale-1';
                            } else if (value.count <= 6) {
                                return 'color-scale-2';
                            } else if (value.count <= 9) {
                                return 'color-scale-3';
                            } else {
                                return 'color-scale-4';
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
