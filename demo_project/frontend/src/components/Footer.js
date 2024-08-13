import React from 'react';
import '../styles/Footer.css';
import fbLogo from '../images/fbLogo.png';
import linkedinLogo from '../images/linkedinLogo.png';
import websiteLogo from '../images/websiteLogo.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__contact-info">
                <div className="footer__contact-section">
                    <h3 className="footer__heading">Contact Us</h3>
                    <p className="footer__text">Institution of Information & Technology</p>
                    <p className="footer__text">University of Dhaka, Dhaka</p>
                    <div className="footer__contact-icons">
                        <a href="https://www.facebook.com/profile.php?id=100075943356304&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                            <img src={fbLogo} alt="Facebook Logo" className="footer__icon" />
                        </a>
                        <a href="https://www.linkedin.com/in/sultana-trina-b98443282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinLogo} alt="LinkedIn Logo" className="footer__icon" />
                        </a>
                        <a href="https://www.du.ac.bd/index.php/webPost/28/949" target="_blank" rel="noopener noreferrer">
                            <img src={websiteLogo} alt="Website Logo" className="footer__icon" />
                        </a>
                    </div>
                </div>
                <div className="footer__contact-details">
                    <h3 className="footer__heading">Any Question?</h3>
                    <p className="footer__text">Email: bsse1307@iit.du.ac.bd</p>
                    <p className="footer__text">Phone: 01938908632</p>
                </div>
            </div>
            <p className="footer__copy">&copy; 2024 CodeSphere. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
