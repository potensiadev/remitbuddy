// Mock API endpoint for logging events
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const eventData = req.body;
  
  // Log to console for development
  console.log('📊 Event received:', eventData);
  
  // In production, you would send this to your analytics service
  // await sendToAnalytics(eventData);
  
  res.status(200).json({ success: true });
}