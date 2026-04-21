import React from 'react';

const Sidebar = ({ setPage }) => {
  const linkStyle = { padding: '10px', cursor: 'pointer', color: 'white', display: 'block', textDecoration: 'none' };
  
  return (
    <div style={{ width: '200px', height: '100vh', background: '#1e293b', padding: '20px', position: 'fixed' }}>
      <h3 style={{ color: '#10b981' }}>Smart Finance</h3>
      <nav style={{ marginTop: '30px' }}>
        <a style={linkStyle} onClick={() => setPage('dashboard')}>📊 Dashboard</a>
        <a style={linkStyle} onClick={() => setPage('analytics')}>📈 Analytics</a>
        <a style={linkStyle} onClick={() => setPage('settings')}>⚙️ Settings</a>
      </nav>
    </div>
  );
};

export default Sidebar;