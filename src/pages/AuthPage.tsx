import { useState } from 'react';
import styles from './AuthPage.module.css';
import { Button } from '../components/common';
import { useAuth } from '../services';

type Mode = 'login' | 'register' | 'reset';

export function AuthPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (mode === 'register' && password !== confirmPassword) {
      setError('Les contrasenyes no coincideixen.');
      return;
    }

    if (mode === 'register' && password.length < 6) {
      setError('La contrasenya ha de tenir almenys 6 caràcters.');
      return;
    }

    setSubmitting(true);

    if (mode === 'login') {
      const err = await signIn(email, password);
      if (err) setError(err.message);
    } else if (mode === 'register') {
      const err = await signUp(email, password);
      if (err) {
        setError(err.message);
      } else {
        setInfo('Compte creat! Revisa el teu correu per confirmar el registre.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const err = await resetPassword(email);
      if (err) {
        setError(err.message);
      } else {
        setInfo("T'hem enviat un correu per restablir la contrasenya.");
        setMode('login');
      }
    }

    setSubmitting(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.logo}>📖</span>
        <h1 className={styles.title}>Lletrimon</h1>
        <p className={styles.subtitle}>Aprèn a llegir en català</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>
          {mode === 'login' && 'Iniciar sessió'}
          {mode === 'register' && 'Crear compte'}
          {mode === 'reset' && 'Recuperar contrasenya'}
        </h2>

        {error && <p className={styles.error}>{error}</p>}
        {info && <p className={styles.info}>{info}</p>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="auth-email">Correu electrònic</label>
          <input
            id="auth-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@correu.cat"
            required
            autoFocus
          />
        </div>

        {mode !== 'reset' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">Contrasenya</label>
            <input
              id="auth-password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínim 6 caràcters"
              required
              minLength={6}
            />
          </div>
        )}

        {mode === 'register' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-confirm">Confirmar contrasenya</label>
            <input
              id="auth-confirm"
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeteix la contrasenya"
              required
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className={styles.submitBtn}
        >
          {submitting ? '...' : (
            mode === 'login' ? 'Entrar' :
            mode === 'register' ? 'Crear compte' :
            'Enviar correu'
          )}
        </Button>

        <div className={styles.links}>
          {mode === 'login' && (
            <>
              <button type="button" className={styles.link} onClick={() => { setMode('register'); setError(''); setInfo(''); }}>
                No tens compte? Registra't
              </button>
              <button type="button" className={styles.link} onClick={() => { setMode('reset'); setError(''); setInfo(''); }}>
                Has oblidat la contrasenya?
              </button>
            </>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <button type="button" className={styles.link} onClick={() => { setMode('login'); setError(''); setInfo(''); }}>
              ← Tornar a iniciar sessió
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
