import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AddMenuItem from '../components/AddMenuItem';
import EditMenuItem from '../components/EditMenuItem';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => { fetchItems(); }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items').select('*').order('id', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin-login');
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const isAvailable = currentStatus === false ? false : true;
      const { error } = await supabase
        .from('items')
        .update({ is_available: !isAvailable })
        .eq('id', id);
        
      if (error) throw error;
      
      setItems(items.map(item => item.id === id ? { ...item, is_available: !isAvailable } : item));
      showNotification(`Item marked as ${!isAvailable ? 'Available' : 'Unavailable'}!`);
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
      showNotification('Item deleted');
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  const handleAddSuccess = (newItem) => {
    setItems([...items, newItem]);
    setShowAddModal(false);
    showNotification('Item added!');
  };

  const handleEditSuccess = (updatedItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditItem(null);
    showNotification('Item updated!');
  };

  const typeColor = { veg: '#16a34a', nonveg: '#dc2626', egg: '#d97706' };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8f9fa', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: '#6b7280', fontSize: 14 }}>Loading menu items…</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .admin-table { display: table; }
        .admin-cards { display: none; }
        @media (max-width: 640px) {
          .admin-table { display: none !important; }
          .admin-cards { display: block !important; }
          .admin-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .admin-header-btns { width: 100% !important; justify-content: flex-end !important; }
          .admin-title { font-size: 16px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate('/')} style={{ padding: '7px 13px', background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
              ← Back
            </button>
            <span className="admin-title" style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>Admin Dashboard</span>
          </div>
          <div className="admin-header-btns" style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowAddModal(true)} style={{ padding: '8px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              + Add Item
            </button>
            <button onClick={handleLogout} style={{ padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px' }}>

        {notification.message && (
          <div style={{
            padding: '12px 16px', marginBottom: 16, borderRadius: 8,
            background: notification.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: notification.type === 'error' ? '#991b1b' : '#166534',
            borderLeft: `4px solid ${notification.type === 'error' ? '#ef4444' : '#22c55e'}`,
            fontWeight: 500, fontSize: 14
          }}>
            {notification.message}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {/* Desktop Table */}
          <div className="admin-table" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Name', 'Price', 'Category', 'Type', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827', fontSize: 14 }}>{item.n}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#d97706', fontSize: 14 }}>{item.p}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>{item.categoryId}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${typeColor[item.type] || '#888'}15`, color: typeColor[item.type] || '#888', border: `1px solid ${typeColor[item.type] || '#888'}30`, textTransform: 'capitalize' }}>{item.type}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, verticalAlign: 'middle', marginRight: 8 }}>
                        <input type="checkbox" checked={item.is_available !== false} onChange={() => handleToggleAvailability(item.id, item.is_available)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: item.is_available !== false ? '#10b981' : '#e5e7eb', borderRadius: 24, transition: '.3s' }}>
                          <span style={{ position: 'absolute', height: 18, width: 18, left: 3, bottom: 3, backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: item.is_available !== false ? 'translateX(20px)' : 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </span>
                      </label>
                      <span style={{ fontSize: 13, fontWeight: 500, color: item.is_available !== false ? '#10b981' : '#9ca3af' }}>{item.is_available !== false ? 'Available' : 'Disabled'}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => setEditItem(item)} style={{ marginRight: 8, padding: '6px 12px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>🗑 Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="admin-cards">
            {items.map(item => (
              <div key={item.id} style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', marginBottom: 4 }}>
                      {item.n}
                      <label style={{ position: 'relative', display: 'inline-block', width: 36, height: 20, verticalAlign: 'middle', marginLeft: 8 }}>
                        <input type="checkbox" checked={item.is_available !== false} onChange={() => handleToggleAvailability(item.id, item.is_available)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: item.is_available !== false ? '#10b981' : '#e5e7eb', borderRadius: 24, transition: '.3s' }}>
                          <span style={{ position: 'absolute', height: 16, width: 16, left: 2, bottom: 2, backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: item.is_available !== false ? 'translateX(16px)' : 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </span>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${typeColor[item.type] || '#888'}15`, color: typeColor[item.type] || '#888', border: `1px solid ${typeColor[item.type] || '#888'}30`, textTransform: 'capitalize' }}>{item.type}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af', textTransform: 'capitalize' }}>{item.categoryId}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#d97706', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 99, padding: '4px 12px', flexShrink: 0 }}>{item.p}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditItem(item)} style={{ flex: 1, padding: '8px', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex: 1, padding: '8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
              No menu items found. Click + Add Item to create one.
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddMenuItem onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} onError={(msg) => showNotification(msg, 'error')} />
      )}
      {editItem && (
        <EditMenuItem item={editItem} onClose={() => setEditItem(null)} onSuccess={handleEditSuccess} onError={(msg) => showNotification(msg, 'error')} />
      )}
    </div>
  );
}
