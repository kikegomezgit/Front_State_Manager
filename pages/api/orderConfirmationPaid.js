let number = 0;

export default function handler(req, res) {
    const { method } = req;
    if (method === 'POST') {
        number += 1;
        if (number % 2 === 1) {
            return res.status(201).json({
                confirmation_id: '#998dkk22334',
            });
        } else {
            return res.status(500).json({ message: 'Simulated Server Error' });
        }

    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}