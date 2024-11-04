import React from 'react';
//import './HomePage.css';

import './HomePage.css'; // Import your CSS file
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './HomePage.css'; // Import your CSS file

const HomePage = () => {
    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>Decentralized Insurance Platform</h1>
                <p>Your trusted partner in automated insurance services.</p>
                <Link to="/create-policy" className="cta-button">Explore Create Policy</Link>
                <Link to="/create-claim" className="cta-button">Explore Claims</Link>
            </header>
            
            <section id="features" className="features-section">
                <h2>Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Smart Contracts</h3>
                        <p>Automate your insurance policies with transparent and secure smart contracts.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Instant Claims</h3>
                        <p>Submit and track claims seamlessly with our easy-to-use interface.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Data Security</h3>
                        <p>Your data is securely stored on the blockchain, ensuring privacy and integrity.</p>
                    </div>
                </div>
            </section>
            
            <footer className="homepage-footer">
                <p>Decentralized Insurance Platform</p>
            </footer>
        </div>
    );
};

export default HomePage;
