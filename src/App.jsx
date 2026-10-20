import React, { useState, useEffect } from 'react';
import { QrCode, Download, ArrowRight, Loader2, User, Mail, Sun, Moon } from 'lucide-react';
import axios from 'axios';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const res = await axios.get('/api/history');
      if (res.data && Array.isArray(res.data)) {
        setHistory(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const generateQRCode = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post('/api/generate', { text });
      setQrCode(res.data.imageUrl);
      
      if (res.data.record) {
        setHistory(prev => [res.data.record, ...prev].slice(0, 20));
      } else {
        fetchHistory(); 
      }
    } catch (error) {
      console.error('Failed to generate QR code', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'digital-heroes-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      {/* Navigation */}
      <header className="header-nav">
        <div className="logo">
          <div className="logo-icon">
            <QrCode size={20} strokeWidth={2.5} />
          </div>
          QR.SCANNER
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            style={{ padding: '8px', borderRadius: '50%', aspectRatio: '1/1' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section style={{ marginBottom: '64px' }}>
          <h1 className="hero-title">
            Generate QR codes.<br />
            <span style={{ color: 'var(--text-secondary)' }}>Instantly.</span>
          </h1>
          <p className="hero-subtitle">
            A premium, high-performance tool to convert any link, text, or data into a scannable QR code. Built with the MERN stack for speed and reliability.
          </p>
        </section>

        {/* Generator Section */}
        <section className="generator-section">
          {/* Input Area */}
          <div className="input-wrapper">
            <form onSubmit={generateQRCode} style={{ display: 'flex', flexDirection: 'column', gap: '48px', flex: 1 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Destination URL or Text
                </label>
                <input 
                  type="text" 
                  className="huge-input" 
                  placeholder="https://your-link.com..." 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                <button type="submit" className="btn-primary" disabled={loading || !text.trim()} style={{ width: '100%' }}>
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
                  {loading ? 'Processing...' : 'Generate Code'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Area */}
          <div className="preview-box">
            {qrCode ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="qr-image-wrapper">
                  <img src={qrCode} alt="Generated QR Code" />
                </div>
                <button onClick={handleDownload} className="btn-secondary" style={{ width: '100%', maxWidth: '288px', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
                  <Download size={18} /> Download PNG
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <QrCode size={64} strokeWidth={1} style={{ opacity: 0.2, margin: '0 auto 24px auto' }} />
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem' }}>Awaiting Input</p>
                <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Your generated QR code will appear here</p>
              </div>
            )}
          </div>
        </section>

        {/* History Grid */}
        {history.length > 0 && (
          <section>
            <div className="history-grid">
              <div style={{ gridColumn: '1 / -1', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%' }}></div>
                  Recent Generations
                </h3>
              </div>
              {history.map((item) => (
                <div key={item._id} className="history-item">
                  <img src={item.imageUrl} alt={item.text} />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '-0.02em' }}>
            QR.SCANNER
          </div>
          
          <div className="developer-info">
            <div className="info-badge">
              <User size={16} />
              <span>Prathamesh Sonar</span>
            </div>
            <div className="info-badge">
              <Mail size={16} />
              <span>prathameshsonar170@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
