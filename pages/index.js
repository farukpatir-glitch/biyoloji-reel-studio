import { useState } from 'react';

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('egitici');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateVideo = async () => {
    setError(null);
    setResponse(null);
    setLoading(true);

    try {
      const res = await fetch('/api/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), tone: tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Bir hata olustu');
        return;
      }

      setResponse(data);
    } catch (err) {
      setError(err.message || 'Network hatasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Biyoloji Reel Olusturucu</h1>
        <p style={styles.subtitle}>Claude + HeyGen ile otomatik Reel</p>

        <div style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Konu</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ornek: Osmoz, Fotosintez, DNA"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Ton</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="egitici">Egitici</option>
              <option value="komik">Komik ve Eglenceli</option>
              <option value="ciddi">Ciddi ve Akademik</option>
            </select>
          </div>

          <button
            onClick={handleCreateVideo}
            disabled={!topic.trim() || loading}
            style={{
              ...styles.button,
              opacity: !topic.trim() || loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Video Yapiliyor...' : 'Video Yap'}
          </button>
        </div>

        {error && (
          <div style={styles.error}>
            <strong>Hata:</strong> {error}
          </div>
        )}

        {response && (
          <div style={styles.success}>
            <h2>Video Istegi Gonderildi</h2>
            <div style={styles.scriptBox}>
              <h3>Olusturulan Script:</h3>
              <p style={styles.scriptText}>{response.script}</p>
            </div>
            <div style={styles.infoBox}>
              <p><strong>Video ID:</strong> {response.videoId}</p>
              <p>Video HeyGen'de hazirlaniyor (2-5 dakika).</p>
            </div>
            <button
              onClick={() => { setResponse(null); setTopic(''); }}
              style={styles.resetButton}
            >
              Yeni Video Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
  },
  title: { margin: '0 0 10px 0', fontSize: '28px', color: '#333' },
  subtitle: { margin: '0 0 30px 0', color: '#666', fontSize: '14px' },
  form: { marginBottom: '30px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: 'white', cursor: 'pointer' },
  button: { width: '100%', padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fee', border: '1px solid #faa', borderRadius: '6px', padding: '15px', marginBottom: '20px', color: '#c33', fontSize: '14px' },
  success: { background: '#efe', border: '1px solid #afa', borderRadius: '6px', padding: '20px', marginBottom: '20px' },
  scriptBox: { background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '6px', padding: '15px', marginBottom: '15px' },
  scriptText: { margin: '10px 0 0 0', lineHeight: '1.6', fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' },
  infoBox: { background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '15px', marginBottom: '15px', fontSize: '13px' },
  resetButton: { width: '100%', padding: '12px', background: '#764ba2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
};
