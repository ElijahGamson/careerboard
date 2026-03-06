export default async function handler(req, res) {
    try {
        const response = await fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes');
        const data = await response.json();
        res.status(200).json({ content: data[0], author: 'Ron Swanson' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quote' });
    }
}