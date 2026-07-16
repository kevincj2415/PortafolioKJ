export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API || process.env.VITE_OPENWEATHER_API;
    if (!apiKey) throw new Error("Missing OPENWEATHER_API");

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Pereira,CO&appid=${apiKey}&units=metric&lang=es`);
    const wData = await response.json();
    
    if (wData.weather) {
      res.status(200).json(wData);
    } else {
      res.status(404).json({ error: 'Weather not found' });
    }
  } catch (error) {
    console.error("API Weather Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
