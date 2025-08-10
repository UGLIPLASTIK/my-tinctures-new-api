const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post('/items', async (req, res) => {
  const { name, sector, actual_quantity, recommended, compound } = req.body;
  const { data, error } = await supabase
    .from('tinctures')
    .insert([{ name, sector, actual_quantity, recommended, compound }]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.get('/items', async (_, res) => {
  const { data, error } = await supabase.from('tinctures').select('*');
  if (error) return res.status(400).json(error);
  res.json(data);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, sector, actual_quantity, recommended, compound } = req.body;
  const { data, error } = await supabase
    .from('tinctures')
    .update({ name, sector, actual_quantity, recommended, compound })
    .eq('id', id);

  if (error) return res.status(400).json(error);
  res.json(data);
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
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
