import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import data from '../../../db.json';

export default function Seeder() {
  const [log, setLog] = useState('Ready to seed.');

  const handleSeed = async () => {
    try {
      setLog('Parsing...');
      const items = data.items || [];
      if (!items.length) {
        setLog('No items found in db.json');
        return;
      }

      setLog(`Found ${items.length} items. Deleting old...`);
      const { error: delErr } = await supabase.from('items').delete().neq('id', 0);
      if (delErr) {
        setLog('Error deleting: ' + delErr.message);
        return;
      }

      setLog('Inserting new items...');
      const { data: resData, error: insErr } = await supabase.from('items').insert(items).select();
      
      if (insErr) {
        setLog('Error inserting: ' + insErr.message);
      } else {
        setLog(`Successfully inserted ${(resData || []).length} items!`);
      }

    } catch(e) {
      setLog('Exception: ' + e.message);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h2>Database Seeder</h2>
      <button onClick={handleSeed} style={{ padding: '10px 20px', fontSize: 16 }}>Run Seed</button>
      <div style={{ marginTop: 20, padding: 10, background: '#eee' }}>{log}</div>
    </div>
  );
}
