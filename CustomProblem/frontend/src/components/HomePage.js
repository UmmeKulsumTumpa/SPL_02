import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/HomePage.css';
import GIFImage from '../images/gifImage.gif'; // Replace with your actual GIF image path
import fbLogo from '../images/fbLogo.png';
import linkedinLogo from '../images/linkedinLogo.png';
import websiteLogo from '../images/websiteLogo.png';

function HomePage() {
  return (
    <div className="container">
      <Header />
      <main>
        <h1 className="rise-anima">Welcome to CodeSphere</h1>
        <div className="content">
          <div className="left-section">
            <div className="about-us">
              <h2>About Us</h2>
            </div>
            <div className="codesphere-description">
              <p className="rise-animation">
                CodeSphere is a collaborative coding platform designed to enhance the coding learning experience for individuals in our institution. The platform encourages collaboration, provides an inclusive environment for both problem solvers and problem creators, and offers a user-friendly interface.
              </p>
            </div>
          </div>
          <div className="middle-section">
  <div className="about">
    <h2>What's New</h2>
  </div>
  <div className="codesphere">
    <p className="rise-animation">
      With CodeSphere, organizing contests is a breeze. Our intuitive interface allows you to create contests with ease, giving you the freedom to customize every aspect according to your preferences.Say goodbye to limitations. At CodeSphere, you have the power to add any custom problem to your contest, allowing you to unleash your creativity and challenge your peers in unique ways.
    </p>
  </div>
</div>
          <div className="right-section">
            <div className="gif-image">
              <img src={GIFImage} alt="CodeSphere GIF" />
            </div>
          </div>
        </div>
        <div className="contact-info">
          <div className="contact-section">
            <h3><i>Contact Us</i></h3>
            <p><i>Institution of Information & Technology</i></p>
            <p><i>University of Dhaka, Dhaka</i></p>
            <div className="contact-icons">
              <a href="https://www.facebook.com/profile.php?id=100075943356304&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <img src={fbLogo} alt="Facebook Logo" />
              </a>
              <a href="https://www.linkedin.com/in/sultana-trina-b98443282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                <img src={linkedinLogo} alt="LinkedIn Logo" />
              </a>
              <a href="https://www.du.ac.bd/index.php/webPost/28/949" target="_blank" rel="noopener noreferrer">
                <img src={websiteLogo} alt="Website Logo" />
              </a>
            </div>
          </div>
          <div className="contact-details">
            <p></p>
            <h2><b><i>Any Question?</i></b></h2>
            <p>Email: bsse1307@iit.du.ac.bd</p>
            <p>Phone: 01938908632</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
