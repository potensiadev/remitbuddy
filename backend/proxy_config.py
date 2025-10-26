"""
프록시 설정 관리 모듈
실제 운영 환경에서는 환경 변수나 암호화된 설정 파일을 사용하세요.
"""

import os
import json
from typing import List, Dict
from proxy_manager import ProxyConfig

class ProxyConfigManager:
    def __init__(self):
        self.config_file = "proxy_config.json"
        self.proxies = []
        self.load_config()

    def load_config(self):
        """프록시 설정을 환경 변수 또는 파일에서 로드"""
        # 1. 환경 변수에서 먼저 로드 시도 (우선순위가 높음)
        env_proxies = load_proxies_from_env()
        if env_proxies:
            print(f"✅ Loaded {len(env_proxies)} proxies from environment variables")
            self.proxies = env_proxies
            return

        # 2. 파일에서 로드
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    data = json.load(f)
                    proxies_from_file = data.get('proxies', [])
                    # 예시 프록시가 아닌 실제 프록시만 로드
                    real_proxies = [p for p in proxies_from_file if 'example.com' not in p.get('ip', '')]
                    if real_proxies:
                        print(f"✅ Loaded {len(real_proxies)} proxies from config file")
                        self.proxies = real_proxies
                    else:
                        print("⚠️ No valid proxies found in config file (only examples)")
                        self.proxies = []
            else:
                print("ℹ️ No proxy config file found")
                self.proxies = []
        except Exception as e:
            print(f"❌ Error loading proxy config: {e}")
            self.proxies = []
    
    def create_default_config(self):
        """기본 프록시 설정 파일 생성"""
        default_config = {
            "proxies": [
                # 예시 프록시 설정들 - 실제 운영에서는 실제 프록시 정보로 교체
                {
                    "ip": "proxy1.example.com",
                    "port": 8080,
                    "username": "user1",
                    "password": "pass1",
                    "protocol": "http",
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20
                },
                {
                    "ip": "proxy2.example.com", 
                    "port": 8080,
                    "username": "user2",
                    "password": "pass2",
                    "protocol": "http",
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20
                },
                {
                    "ip": "proxy3.example.com",
                    "port": 8080,
                    "username": "user3", 
                    "password": "pass3",
                    "protocol": "http",
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20
                }
            ]
        }
        
        with open(self.config_file, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        self.proxies = default_config['proxies']
    
    def get_proxy_configs(self) -> List[ProxyConfig]:
        """ProxyConfig 객체 리스트 반환"""
        return [ProxyConfig(**proxy_data) for proxy_data in self.proxies]
    
    def add_proxy(self, proxy_data: Dict):
        """새 프록시 추가"""
        self.proxies.append(proxy_data)
        self.save_config()
    
    def remove_proxy(self, ip: str):
        """프록시 제거"""
        self.proxies = [p for p in self.proxies if p['ip'] != ip]
        self.save_config()
    
    def save_config(self):
        """설정을 파일에 저장"""
        config = {"proxies": self.proxies}
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)

# 환경 변수에서 프록시 설정 로드
def load_proxies_from_env():
    """
    환경 변수에서 프록시 설정 로드

    환경 변수 형태:
    - HANPASS_PROXY_1=ip:port:username:password
    - HANPASS_PROXY_2=ip:port:username:password
    또는
    - HANPASS_PROXY_URL=http://username:password@ip:port (단일 프록시)

    예시:
    - HANPASS_PROXY_1=proxy.example.com:8080:user1:pass1
    - HANPASS_PROXY_URL=http://user:pass@proxy.example.com:8080
    """
    proxies = []

    # 방법 1: HANPASS_PROXY_URL (단일 프록시, 간단한 형태)
    proxy_url = os.getenv('HANPASS_PROXY_URL')
    if proxy_url:
        try:
            # Parse proxy URL: http://username:password@ip:port
            import re
            match = re.match(r'(https?://)?(?:([^:]+):([^@]+)@)?([^:]+):(\d+)', proxy_url)
            if match:
                protocol = match.group(1).rstrip('://') if match.group(1) else 'http'
                username = match.group(2)
                password = match.group(3)
                ip = match.group(4)
                port = int(match.group(5))

                proxy_config = {
                    "ip": ip,
                    "port": port,
                    "username": username,
                    "password": password,
                    "protocol": protocol,
                    "max_concurrent": 5,
                    "rate_limit_per_minute": 30
                }
                proxies.append(proxy_config)
                print(f"✅ Loaded proxy from HANPASS_PROXY_URL: {ip}:{port}")
        except Exception as e:
            print(f"❌ Error parsing HANPASS_PROXY_URL: {e}")

    # 방법 2: HANPASS_PROXY_1, HANPASS_PROXY_2, ... (다중 프록시)
    i = 1
    while True:
        proxy_env = os.getenv(f'HANPASS_PROXY_{i}')
        if not proxy_env:
            break

        try:
            parts = proxy_env.split(':')
            if len(parts) >= 2:
                proxy_config = {
                    "ip": parts[0],
                    "port": int(parts[1]),
                    "username": parts[2] if len(parts) > 2 else None,
                    "password": parts[3] if len(parts) > 3 else None,
                    "protocol": "http",
                    "max_concurrent": 5,
                    "rate_limit_per_minute": 30
                }
                proxies.append(proxy_config)
                print(f"✅ Loaded proxy from HANPASS_PROXY_{i}: {parts[0]}:{parts[1]}")
        except Exception as e:
            print(f"❌ Error parsing HANPASS_PROXY_{i}: {e}")

        i += 1

    return proxies

# 전역 프록시 설정 매니저
proxy_config_manager = ProxyConfigManager()