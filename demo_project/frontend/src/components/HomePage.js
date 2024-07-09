import React from 'react';
import '../styles/HomePage.css';
import GIFImage from '../images/gifImage.gif';

function HomePage() {
	return (
		<div className="container">
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
			</main>
		</div>
	);
}

export default HomePage;
