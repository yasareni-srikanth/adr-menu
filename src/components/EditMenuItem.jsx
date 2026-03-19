import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function EditMenuItem({ item, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    n: '',
    p: '',
    categoryId: 'beverages',
    sectionSub: '',
    type: 'veg',
    is_available: true
  });
  const [loading, setLoading] = useState(false);
  const [rlsError, setRlsError] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        n: item.n || '',
        p: Array.isArray(item.p) ? item.p[0] : (item.p || ''),
        categoryId: item.categoryId || 'beverages',
        sectionSub: item.sectionSub || '',
        type: item.type || 'veg',
        is_available: item.is_available !== false
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRlsError(false);

    // Convert price to number
    const payload = { ...formData, p: Number(formData.p) };

    try {
      const { data, error } = await supabase
        .from('items')
        .update(payload)
        .eq('id', item.id)
        .select();

      if (error) {
        if (error.message && error.message.toLowerCase().includes('row-level security')) {
          setRlsError(true);
          setLoading(false);
          return;
        }
        throw error;
      }

      // Fallback to merged item if Supabase doesn't return the updated row (RLS SELECT may block)
      const updatedItem = (Array.isArray(data) && data.length > 0) ? data[0] : { ...item, ...payload };
      onSuccess(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      onError(`Error updating item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: '#fff', padding: '28px 32px', borderRadius: 24, width: '100%', maxWidth: 460, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontFamily: "'DM Sans', sans-serif", border: '1px solid rgba(180,83,9,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: 24, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#1f2937' }}>Edit Item</h3>
        {rlsError && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, lineHeight: 1.4 }}>
            ⚠️ <strong>Supabase blocked this update.</strong> To enable saving, paste the contents of <code>fix_rls_and_seed.sql</code> into the <a href="https://app.supabase.com" target="_blank" rel="noreferrer" style={{ color: '#d97706', fontWeight: 600 }}>Supabase SQL Editor</a> and click Run.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Dish Name</label>
            <input required type="text" value={formData.n} onChange={e => setFormData({ ...formData, n: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#d97706'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Price</label>
            <input required type="number" value={formData.p} onChange={e => setFormData({ ...formData, p: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#d97706'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Category ID</label>
            <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 16px top 55%', backgroundSize: '10px auto' }}>
              <option value="beverages">Beverages</option>
              <option value="soups">Soups</option>
              <option value="starters">Starters</option>
              <option value="tandoori">Tandoori</option>
              <option value="breads">Breads</option>
              <option value="vegcurry">Veg Curry</option>
              <option value="nonveg">Non-Veg Curry</option>
              <option value="biryani">Biryani</option>
              <option value="noodles">Noodles</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Section Subtitle</label>
            <input type="text" value={formData.sectionSub} onChange={e => setFormData({ ...formData, sectionSub: e.target.value })} placeholder="e.g. Veg Starters" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#d97706'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>Type</label>
            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', appearance: 'none', background: '#fff url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 16px top 55%', backgroundSize: '10px auto' }}>
              <option value="veg">Veg</option>
              <option value="nonveg">Non-Veg</option>
              <option value="egg">Egg</option>
            </select>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, marginRight: 10 }}>
                <input type="checkbox" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.is_available ? '#10b981' : '#e5e7eb', borderRadius: 24, transition: '.3s' }}>
                  <span style={{ position: 'absolute', height: 18, width: 18, left: 3, bottom: 3, backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: formData.is_available ? 'translateX(20px)' : 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </span>
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: formData.is_available ? '#10b981' : '#6b7280' }}>
                {formData.is_available ? 'Item is Available' : 'Item is Disabled'}
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <button type="button" onClick={onClose} disabled={loading} style={{ padding: '12px 20px', background: '#f3f4f6', color: '#4b5563', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
