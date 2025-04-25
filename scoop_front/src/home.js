import React, { useEffect } from 'react';
import './home.css';

function Home() {
  useEffect(() => {
    // Dynamically create and append the Font Awesome script
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/ad6f7e303a.js';
    script.crossOrigin = 'anonymous';
    script.async = true; // Load the script asynchronously
    document.body.appendChild(script);

    // Cleanup function to remove the script tag when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div className="home-container">
    
      <header className="header-content">
        <nav className="navbar">
          <div className="navbar_logo">
            <i className="fa-brands fa-discord"></i> {/* Discord Icon */}
            <a href="/home" className="navbar-logo-link">Discord</a>
          </div>
  
          <div className="navbar_icon">
            <a href="/login" className="login-link">
              <button className="login-button">Login</button>
            </a>
          </div>
        </nav>
      </header>
  
      
      <div className="mainsidebar">
        <main className="main-content">
          <div className="welcome-message">
            <h1>Welcome to my website!!!</h1>
          </div>
  
          <div className="logo-section">
            <img
              src="https://i0.wp.com/designcompass.org/wp-content/uploads/2025/02/logo-discord.png?fit=768%2C576&ssl=1"
              alt="Discord Logo"
              className="discord-logo"
            />
          </div>
  
          <div className="start-button-wrapper">
            <a href="/" className="start-link">
              <button className="start-button">시작하기</button>
            </a>
          </div>
        </main>
  
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="sidebar-content">
            <img
              src="https://support.discord.com/hc/article_attachments/360060867451"
              className="sidebar-image"
              alt="Discord Features"
            />
            <p className="sidebar-text">
              Discord's advantages lie not only in its ability to facilitate communication through servers and
              channels, but also in its collaboration features, making it highly useful for teamwork and project
              management.
            </p>
            </div>
          <h3 className="sidebar-quote">"Hurry up and start"</h3>
        
        </aside>
      </div>
  
      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <a href="/home" className="footer-link">홈</a>
        </div>
        <p className="footer-text">© 2025 회사명. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}

export default Home;
