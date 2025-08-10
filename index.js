const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post('/items', async (req, res) => {
  const { name, sector, actual_quantity, recommended_quantity, compound } =
    req.body;
  const { data, error } = await supabase
    .from('tinctures')
    .insert([
      { name, sector, actual_quantity, recommended_quantity, compound },
    ]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get('/items', async (_, res) => {
  const { data, error } = await supabase.from('tinctures').select('*');
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get('/ping', (_, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PING_INTERVAL = 3 * 60 * 1000; // 3 минуты
const SELF_URL =
  process.env.SELF_URL ||
  'https://my-tinctures-new-api-production.up.railway.app/ping';

setInterval(async () => {
  try {
    const res = await fetch(SELF_URL);
    const text = await res.text();
    console.log(`[PING] Status: ${res.status}, Response: ${text}`);
  } catch (err) {
    console.error('[PING] Error:', err.message);
  }
}, PING_INTERVAL);

app.put('/items', async (req, res) => {
  const { id, name, sector, actual_quantity, recommended_quantity, compound } =
    req.body;
  const { data, error } = await supabase
    .from('tinctures')
    .update({ name, sector, actual_quantity, recommended_quantity, compound })
    .eq('id', id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete('/items', async (req, res) => {
  const { id } = req.body;
  const { data, error } = await supabase
    .from('tinctures')
    .delete()
    .eq('id', id);
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
