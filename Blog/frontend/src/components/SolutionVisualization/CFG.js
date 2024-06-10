import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CFG = () => {
    const location = useLocation();
    const { cfgData } = location.state || {};

    return (
        <div className="cfg">
            <h2>Control Flow Graph</h2>
            <div>{cfgData ? JSON.stringify(cfgData) : 'No CFG Data Available'}</div>
            <Link to="/solution-visualization" className="btn btn-back">Back</Link>
        </div>
    );
};

export default CFG;
