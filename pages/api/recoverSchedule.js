export default function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        return res.status(201).json({
            schedule: [
                { location: 'north', index: '55', scheduledAt: '8887kjn.4' },
                { location: 'south', index: '44', scheduledAt: '332222ppl.4' },
            ],
        });
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}