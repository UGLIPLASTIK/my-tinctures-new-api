import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // Лучше использовать service_role для сервера
);

// CREATE
app.post('/items', async (req, res) => {
  const { name, sector, actual_quantity, recommended, compound } = req.body;
  const { data, error } = await supabase
    .from('items')
    .insert([{ name, sector, actual_quantity, recommended, compound }]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// READ
app.get('/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');

  if (error) return res.status(400).json(error);
  res.json(data);
});

// UPDATE
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sector, actual_quantity, recommended, compound } = req.body;
  const { data, error } = await supabase
    .from('items')
    .update({ name, sector, actual_quantity, recommended, compound })
    .eq('id', id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// DELETE
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('items').delete().eq('id', id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
