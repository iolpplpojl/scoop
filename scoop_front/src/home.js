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
    <div>
      {/* Header Section */}
      <header>
        <nav className="navbar">
          <div className="navbar_logo">
            <i className="fa-brands fa-discord"></i> {/* Discord Icon */}
            <a href="/home">Discord</a>
          </div>

          <ul className="navbar_menu">
            {/* Add menu items here if needed */}
          </ul>

          <ul className="navbar_icon">
            <a href="/login">
              <button className="login-button">Login</button>
            </a>
          </ul>
        </nav>
      </header>

      {/* Main Content Section */}
      <div className="container">
        <main className="main">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1>Welcome to my website!!!</h1>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src="https://i0.wp.com/designcompass.org/wp-content/uploads/2025/02/logo-discord.png?fit=768%2C576&ssl=1"
              alt="Discord Logo"
              style={{ maxWidth: '360px', height: '200px' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="/">
              <button className="start-button" style={{ padding: '10px 20px', fontSize: '16px' }}>
                시작하기
              </button>
            </a>
          </div>
        </main>

        {/* Sidebar Section */}
        <aside className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://support.discord.com/hc/article_attachments/360060867451"
              style={{ maxWidth: '430px', height: '320px', marginLeft: '80px' }}
              alt="Discord Features"
            />
            <p style={{ marginLeft: '25px' }}>
              Discord's advantages lie not only in its ability to facilitate communication through servers and
              channels, but also in its collaboration features, making it highly useful for teamwork and project
              management.
            </p>
          </div>
          <h3>"Hurry up and start"</h3>
        </aside>
      </div>

      {/* Footer Section */}
      <footer>
        <div className="footer-links">
          <a href="/home">홈</a>
        </div>
        <p className="footer-text">© 2025 회사명. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}

export default Home;
