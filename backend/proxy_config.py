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
        """프록시 설정을 파일에서 로드"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r') as f:
                    data = json.load(f)
                    self.proxies = data.get('proxies', [])
            else:
                self.create_default_config()
        except Exception as e:
            print(f"프록시 설정 로드 오류: {e}")
            self.create_default_config()
    
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

# 환경 변수에서 프록시 설정 로드 (선택사항)
def load_proxies_from_env():
    """환경 변수에서 프록시 설정 로드"""
    proxies = []
    
    # 환경 변수 형태: PROXY_1=ip:port:username:password
    i = 1
    while True:
        proxy_env = os.getenv(f'PROXY_{i}')
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
                    "max_concurrent": 3,
                    "rate_limit_per_minute": 20
                }
                proxies.append(proxy_config)
        except Exception as e:
            print(f"환경 변수 프록시 설정 오류 {i}: {e}")
        
        i += 1
    
    return proxies

# 전역 프록시 설정 매니저
proxy_config_manager = ProxyConfigManager()