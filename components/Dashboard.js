import React, { useState } from 'react';
import PolicyCreation from './PolicyCreation';
import PolicyList from './PolicyList';
import ClaimProcessing from './ClaimProcessing';
import './Dashboard.css';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('createPolicy');

    return (
        <div className="dashboard">
            <nav className="sidebar">
                <button onClick={() => setActiveSection('createPolicy')}>Create Policy</button>
                <button onClick={() => setActiveSection('policyList')}>Policy List</button>
                <button onClick={() => setActiveSection('claimProcessing')}>Claim Processing</button>
            </nav>

            <main className="content">
                {activeSection === 'createPolicy' && <PolicyCreation />}
                {activeSection === 'policyList' && <PolicyList />}
                {activeSection === 'claimProcessing' && <ClaimProcessing />}
            </main>
        </div>
    );
};

export default Dashboard;
