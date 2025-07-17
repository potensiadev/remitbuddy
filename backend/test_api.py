#!/usr/bin/env python3
import asyncio
import aiohttp
import time
import sys

async def test_api():
    """Test the API performance"""
    url = "http://localhost:8000/api/getRemittanceQuote"
    params = {
        "receive_country": "Vietnam",
        "receive_currency": "VND", 
        "send_amount": 1000000
    }
    
    start_time = time.time()
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                elapsed = time.time() - start_time
                
                print(f"⏱️  Response time: {elapsed:.2f}s")
                print(f"📊 Status: {response.status}")
                print(f"🔄 Results count: {len(data.get('results', []))}")
                
                if data.get('results'):
                    print(f"🥇 Best provider: {data['results'][0]['provider']}")
                    print(f"💰 Best rate: {data['results'][0]['recipient_gets']:,.0f} VND")
                
                return data
                
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    asyncio.run(test_api())