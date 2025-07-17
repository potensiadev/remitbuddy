#!/usr/bin/env python3
"""
프록시 시스템 테스트 스크립트
"""
import asyncio
import aiohttp
import json
import sys
import time
from proxy_manager import ProxyManager, ProxyConfig

async def test_proxy_system():
    """프록시 시스템 기본 테스트"""
    print("🔄 프록시 시스템 테스트 시작...")
    
    # 프록시 매니저 초기화
    proxy_manager = ProxyManager()
    
    # 테스트용 프록시 추가 (실제 프록시로 교체 필요)
    test_proxies = [
        # 실제 프록시 정보로 교체하세요
        # ProxyConfig(
        #     ip="proxy1.example.com",
        #     port=8080,
        #     username="user1",
        #     password="pass1",
        #     max_concurrent=2,
        #     rate_limit_per_minute=10
        # )
    ]
    
    for proxy in test_proxies:
        proxy_manager.add_proxy(proxy)
    
    print(f"📊 등록된 프록시 수: {len(proxy_manager.proxies)}")
    
    if not proxy_manager.proxies:
        print("⚠️  프록시가 설정되지 않았습니다. 직접 연결로 테스트합니다.")
        return await test_direct_connection()
    
    # 프록시 헬스 체크
    print("🔍 프록시 헬스 체크 실행...")
    await proxy_manager.health_check_all_proxies()
    
    # 프록시 통계 출력
    stats = proxy_manager.get_proxy_stats()
    print(f"📈 프록시 통계: {json.dumps(stats, indent=2)}")
    
    # 실제 요청 테스트
    print("🌐 실제 요청 테스트...")
    test_url = "https://httpbin.org/ip"
    
    for i in range(5):
        proxy = proxy_manager.get_best_proxy()
        if proxy:
            print(f"🔄 요청 {i+1}: 프록시 {proxy.ip} 사용")
            proxy_manager.mark_proxy_used(proxy)
            
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(test_url, proxy=proxy.url) as response:
                        result = await response.json()
                        print(f"✅ 응답: {result}")
                        proxy_manager.mark_proxy_completed(proxy, success=True)
            except Exception as e:
                print(f"❌ 오류: {e}")
                proxy_manager.mark_proxy_completed(proxy, success=False)
        else:
            print(f"⚠️  사용 가능한 프록시가 없습니다.")
        
        await asyncio.sleep(1)
    
    # 최종 통계
    final_stats = proxy_manager.get_proxy_stats()
    print(f"📊 최종 통계: {json.dumps(final_stats, indent=2)}")

async def test_direct_connection():
    """직접 연결 테스트"""
    print("🌐 직접 연결 테스트...")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get("https://httpbin.org/ip") as response:
                result = await response.json()
                print(f"✅ 직접 연결 성공: {result}")
                return True
    except Exception as e:
        print(f"❌ 직접 연결 실패: {e}")
        return False

async def test_api_endpoint():
    """API 엔드포인트 테스트"""
    print("🔌 API 엔드포인트 테스트...")
    
    api_url = "http://localhost:8000/api/getRemittanceQuote"
    params = {
        "receive_country": "Vietnam",
        "receive_currency": "VND",
        "send_amount": 1000000
    }
    
    start_time = time.time()
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    elapsed = time.time() - start_time
                    
                    print(f"⏱️  응답 시간: {elapsed:.2f}초")
                    print(f"📊 결과 수: {len(data.get('results', []))}")
                    
                    if data.get('results'):
                        print(f"🥇 최고 업체: {data['results'][0]['provider']}")
                        print(f"💰 최고 환율: {data['results'][0]['recipient_gets']:,.0f} VND")
                    
                    return True
                else:
                    print(f"❌ API 오류: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ API 테스트 실패: {e}")
        return False

async def main():
    """메인 테스트 함수"""
    print("🚀 프록시 시스템 종합 테스트 시작")
    print("=" * 50)
    
    # 1. 프록시 시스템 테스트
    await test_proxy_system()
    
    print("\n" + "=" * 50)
    
    # 2. API 엔드포인트 테스트
    await test_api_endpoint()
    
    print("\n" + "=" * 50)
    print("✅ 모든 테스트 완료!")

if __name__ == "__main__":
    asyncio.run(main())