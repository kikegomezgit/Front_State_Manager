let number = 0;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        number += 1;

        if (number % 2 === 1) {
            return res.status(201).json({ job_id: '45345k34k534k5jj' });
        } else {
            return res.status(500).json({ message: 'non' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}