// Analytics event logging API endpoint
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.event || !eventData.timestamp) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: event, timestamp' 
      });
    }
    
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event received:', {
        event: eventData.event,
        user_uuid: eventData.user_uuid,
        timestamp: eventData.timestamp,
        data: {
          ...eventData,
          event: undefined,
          user_uuid: undefined,
          timestamp: undefined,
          url: undefined
        }
      });
    }
    
    // Add server-side metadata
    const enrichedEventData = {
      ...eventData,
      server_timestamp: new Date().toISOString(),
      ip_address: req.headers['x-forwarded-for'] || 
                  req.headers['x-real-ip'] || 
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  (req.connection.socket ? req.connection.socket.remoteAddress : null),
      user_agent: req.headers['user-agent'],
      referer: req.headers.referer
    };
    
    // In production, you would:
    // 1. Send to your analytics database (MongoDB, PostgreSQL, etc.)
    // 2. Send to external analytics services (Mixpanel, Amplitude, etc.)
    // 3. Queue for batch processing
    
    // Example: Save to database
    // await saveEventToDatabase(enrichedEventData);
    
    // Example: Send to external service
    // await sendToExternalAnalytics(enrichedEventData);
    
    // For now, just acknowledge receipt
    res.status(200).json({ 
      success: true,
      message: 'Event logged successfully',
      event_id: `${eventData.user_uuid}_${Date.now()}`
    });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}