'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './admin.module.css';

function formatSEK(amount) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount / 100);
}

function formatDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatMonth(key) {
  const [year, month] = key.split('-');
  return new Date(year, month - 1).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long'
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async (pw) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-auth': pw }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Fel vid hämtning');
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (!password.trim()) return;
    // Optimistically try login, API will reject if wrong
    setAuthError('');
    fetch('/api/admin/stats', {
      headers: { 'x-admin-auth': password }
    }).then(res => {
      if (res.status === 401) {
        setAuthError('Fel lösenord.');
      } else {
        setAuthed(true);
        fetchStats(password);
      }
    });
  }

  if (!authed) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>A2</div>
          <h1 className={styles.loginTitle}>Admin</h1>
          <p className={styles.loginSub}>Logga in för att se försäljningsstatistik</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.loginInput}
              autoFocus
            />
            {authError && <p className={styles.loginError}>{authError}</p>}
            <button type="submit" className={styles.loginBtn}>
              Logga in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <span className={styles.brand}>A2</span>
            <span className={styles.headerLabel}>Admin</span>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchStats(password)}
            disabled={loading}
          >
            {loading ? 'Laddar…' : 'Uppdatera'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {loading && !stats && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Hämtar statistik från Stripe…</p>
          </div>
        )}
        {error && <div className={styles.errorBox}>{error}</div>}

        {stats && (
          <>
            {/* KPI cards */}
            <section className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Total intäkt</p>
                <p className={styles.kpiValue}>{formatSEK(stats.totalRevenue)}</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Antal beställningar</p>
                <p className={styles.kpiValue}>{stats.totalOrders}</p>
              </div>
              <div className={styles.kpiCard}>
                <p className={styles.kpiLabel}>Snittorder</p>
                <p className={styles.kpiValue}>
                  {stats.totalOrders > 0
                    ? formatSEK(Math.round(stats.totalRevenue / stats.totalOrders))
                    : '–'}
                </p>
              </div>
            </section>

            {/* Monthly revenue */}
            {stats.monthlyData.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Intäkt per månad</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Månad</th>
                        <th className={styles.right}>Intäkt</th>
                        <th className={styles.right}>Andel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...stats.monthlyData].reverse().map(({ month, revenue }) => (
                        <tr key={month}>
                          <td>{formatMonth(month)}</td>
                          <td className={styles.right}>{formatSEK(revenue)}</td>
                          <td className={styles.right}>
                            {stats.totalRevenue > 0
                              ? `${Math.round((revenue / stats.totalRevenue) * 100)} %`
                              : '–'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Product breakdown */}
            {stats.productData.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Produktförsäljning</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Produkt</th>
                        <th className={styles.right}>Antal</th>
                        <th className={styles.right}>Intäkt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.productData.map(({ name, quantity, revenue }) => (
                        <tr key={name}>
                          <td>{name}</td>
                          <td className={styles.right}>{quantity}</td>
                          <td className={styles.right}>{formatSEK(revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Recent orders */}
            {stats.recentOrders.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Senaste beställningar</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Datum</th>
                        <th>Kund</th>
                        <th className={styles.right}>Belopp</th>
                        <th>Session-ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{formatDate(order.created)}</td>
                          <td>{order.customerEmail}</td>
                          <td className={styles.right}>{formatSEK(order.amount)}</td>
                          <td className={styles.sessionId}>
                            <span title={order.id}>
                              {order.id.slice(0, 20)}…
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {stats.totalOrders === 0 && (
              <div className={styles.emptyState}>
                Inga betalda beställningar hittades i Stripe än.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
