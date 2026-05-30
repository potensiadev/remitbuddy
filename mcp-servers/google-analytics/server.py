"""
RemitBuddy Google Analytics & Search Console MCP Server

This MCP server provides tools to fetch data from:
- Google Search Console (GSC): Search queries, page performance, indexing status
- Google Analytics 4 (GA4): Events, user behavior, traffic data

Usage:
    python server.py
"""

import os
import json
from datetime import datetime, timedelta
from typing import Any
from dotenv import load_dotenv

from mcp.server.fastmcp import FastMCP
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

# Initialize MCP server
mcp = FastMCP("remitbuddy-analytics")

# Google API Scopes
SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',  # GSC
    'https://www.googleapis.com/auth/analytics.readonly',   # GA4
]

# Token storage path
TOKEN_PATH = os.path.join(os.path.dirname(__file__), 'token.json')
CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), 'credentials.json')


def get_credentials() -> Credentials:
    """Get or refresh Google API credentials."""
    creds = None

    # Load existing token
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)

    # Refresh or create new credentials
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Create credentials.json from environment variables
            if not os.path.exists(CREDENTIALS_PATH):
                credentials_data = {
                    "installed": {
                        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                        "redirect_uris": ["http://localhost:8888/"]
                    }
                }
                with open(CREDENTIALS_PATH, 'w') as f:
                    json.dump(credentials_data, f)

            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=8888)

        # Save the credentials for the next run
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())

    return creds


def get_gsc_service():
    """Get Google Search Console service."""
    creds = get_credentials()
    return build('searchconsole', 'v1', credentials=creds)


def get_ga4_service():
    """Get Google Analytics Data API service."""
    creds = get_credentials()
    return build('analyticsdata', 'v1beta', credentials=creds)


# ============================================
# Google Search Console Tools
# ============================================

@mcp.tool()
def gsc_get_search_queries(
    days: int = 7,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get top search queries from Google Search Console.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of queries to return (default: 20)

    Returns:
        Dictionary containing search queries with clicks, impressions, CTR, and position
    """
    try:
        service = get_gsc_service()
        site_url = os.getenv("GSC_SITE_URL", "https://www.remitbuddy.com")

        end_date = datetime.now() - timedelta(days=2)  # GSC data has 2-day delay
        start_date = end_date - timedelta(days=days)

        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['query'],
            'rowLimit': limit,
            'dataState': 'final'
        }

        response = service.searchanalytics().query(
            siteUrl=site_url, body=request
        ).execute()

        queries = []
        for row in response.get('rows', []):
            queries.append({
                'query': row['keys'][0],
                'clicks': row['clicks'],
                'impressions': row['impressions'],
                'ctr': round(row['ctr'] * 100, 2),
                'position': round(row['position'], 1)
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_queries': len(queries),
            'queries': queries
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def gsc_get_page_performance(
    days: int = 7,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get page performance data from Google Search Console.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of pages to return (default: 20)

    Returns:
        Dictionary containing page URLs with clicks, impressions, CTR, and position
    """
    try:
        service = get_gsc_service()
        site_url = os.getenv("GSC_SITE_URL", "https://www.remitbuddy.com")

        end_date = datetime.now() - timedelta(days=2)
        start_date = end_date - timedelta(days=days)

        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['page'],
            'rowLimit': limit,
            'dataState': 'final'
        }

        response = service.searchanalytics().query(
            siteUrl=site_url, body=request
        ).execute()

        pages = []
        for row in response.get('rows', []):
            pages.append({
                'page': row['keys'][0],
                'clicks': row['clicks'],
                'impressions': row['impressions'],
                'ctr': round(row['ctr'] * 100, 2),
                'position': round(row['position'], 1)
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_pages': len(pages),
            'pages': pages
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def gsc_get_queries_by_page(
    page_url: str,
    days: int = 7,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get search queries for a specific page.

    Args:
        page_url: The URL of the page to analyze
        days: Number of days to look back (default: 7)
        limit: Maximum number of queries to return (default: 20)

    Returns:
        Dictionary containing queries that led to this page
    """
    try:
        service = get_gsc_service()
        site_url = os.getenv("GSC_SITE_URL", "https://www.remitbuddy.com")

        end_date = datetime.now() - timedelta(days=2)
        start_date = end_date - timedelta(days=days)

        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['query'],
            'dimensionFilterGroups': [{
                'filters': [{
                    'dimension': 'page',
                    'operator': 'contains',
                    'expression': page_url
                }]
            }],
            'rowLimit': limit,
            'dataState': 'final'
        }

        response = service.searchanalytics().query(
            siteUrl=site_url, body=request
        ).execute()

        queries = []
        for row in response.get('rows', []):
            queries.append({
                'query': row['keys'][0],
                'clicks': row['clicks'],
                'impressions': row['impressions'],
                'ctr': round(row['ctr'] * 100, 2),
                'position': round(row['position'], 1)
            })

        return {
            'page': page_url,
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_queries': len(queries),
            'queries': queries
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def gsc_get_country_performance(
    days: int = 7,
    limit: int = 10
) -> dict[str, Any]:
    """
    Get performance data by country from Google Search Console.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of countries to return (default: 10)

    Returns:
        Dictionary containing country-wise performance data
    """
    try:
        service = get_gsc_service()
        site_url = os.getenv("GSC_SITE_URL", "https://www.remitbuddy.com")

        end_date = datetime.now() - timedelta(days=2)
        start_date = end_date - timedelta(days=days)

        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['country'],
            'rowLimit': limit,
            'dataState': 'final'
        }

        response = service.searchanalytics().query(
            siteUrl=site_url, body=request
        ).execute()

        countries = []
        for row in response.get('rows', []):
            countries.append({
                'country': row['keys'][0],
                'clicks': row['clicks'],
                'impressions': row['impressions'],
                'ctr': round(row['ctr'] * 100, 2),
                'position': round(row['position'], 1)
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_countries': len(countries),
            'countries': countries
        }
    except Exception as e:
        return {'error': str(e)}


# ============================================
# Google Analytics 4 Tools
# ============================================

@mcp.tool()
def ga4_get_traffic_overview(
    days: int = 7
) -> dict[str, Any]:
    """
    Get traffic overview from Google Analytics 4.

    Args:
        days: Number of days to look back (default: 7)

    Returns:
        Dictionary containing sessions, users, pageviews, and bounce rate
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'metrics': [
                {'name': 'sessions'},
                {'name': 'totalUsers'},
                {'name': 'screenPageViews'},
                {'name': 'bounceRate'},
                {'name': 'averageSessionDuration'}
            ]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        if response.get('rows'):
            row = response['rows'][0]
            metrics = row['metricValues']
            return {
                'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
                'sessions': int(metrics[0]['value']),
                'users': int(metrics[1]['value']),
                'pageviews': int(metrics[2]['value']),
                'bounce_rate': round(float(metrics[3]['value']) * 100, 2),
                'avg_session_duration': round(float(metrics[4]['value']), 1)
            }
        return {'error': 'No data available'}
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_traffic_by_country(
    days: int = 7,
    limit: int = 10
) -> dict[str, Any]:
    """
    Get traffic breakdown by country from Google Analytics 4.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of countries to return (default: 10)

    Returns:
        Dictionary containing country-wise traffic data
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [{'name': 'country'}],
            'metrics': [
                {'name': 'sessions'},
                {'name': 'totalUsers'},
                {'name': 'screenPageViews'}
            ],
            'limit': limit,
            'orderBys': [{'metric': {'metricName': 'sessions'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        countries = []
        for row in response.get('rows', []):
            countries.append({
                'country': row['dimensionValues'][0]['value'],
                'sessions': int(row['metricValues'][0]['value']),
                'users': int(row['metricValues'][1]['value']),
                'pageviews': int(row['metricValues'][2]['value'])
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_countries': len(countries),
            'countries': countries
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_top_pages(
    days: int = 7,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get top pages by pageviews from Google Analytics 4.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of pages to return (default: 20)

    Returns:
        Dictionary containing top pages with pageviews and engagement metrics
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [{'name': 'pagePath'}],
            'metrics': [
                {'name': 'screenPageViews'},
                {'name': 'averageSessionDuration'},
                {'name': 'bounceRate'}
            ],
            'limit': limit,
            'orderBys': [{'metric': {'metricName': 'screenPageViews'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        pages = []
        for row in response.get('rows', []):
            pages.append({
                'page': row['dimensionValues'][0]['value'],
                'pageviews': int(row['metricValues'][0]['value']),
                'avg_duration': round(float(row['metricValues'][1]['value']), 1),
                'bounce_rate': round(float(row['metricValues'][2]['value']) * 100, 2)
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_pages': len(pages),
            'pages': pages
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_events(
    days: int = 7,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get top events from Google Analytics 4.
    Useful for tracking user interactions like button clicks, form submissions, etc.

    Args:
        days: Number of days to look back (default: 7)
        limit: Maximum number of events to return (default: 20)

    Returns:
        Dictionary containing events with count and unique users
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [{'name': 'eventName'}],
            'metrics': [
                {'name': 'eventCount'},
                {'name': 'totalUsers'}
            ],
            'limit': limit,
            'orderBys': [{'metric': {'metricName': 'eventCount'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        events = []
        for row in response.get('rows', []):
            events.append({
                'event': row['dimensionValues'][0]['value'],
                'count': int(row['metricValues'][0]['value']),
                'users': int(row['metricValues'][1]['value'])
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_events': len(events),
            'events': events
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_provider_clicks(
    days: int = 14,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get provider click data from Google Analytics 4.
    Tracks which remittance providers users are clicking on (click_provider event).

    Args:
        days: Number of days to look back (default: 14)
        limit: Maximum number of providers to return (default: 20)

    Returns:
        Dictionary containing provider click data with provider names and click counts
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Query click_provider events with provider_name parameter
        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [
                {'name': 'customEvent:provider_name'}
            ],
            'metrics': [
                {'name': 'eventCount'},
                {'name': 'totalUsers'}
            ],
            'dimensionFilter': {
                'filter': {
                    'fieldName': 'eventName',
                    'stringFilter': {
                        'matchType': 'EXACT',
                        'value': 'click_provider'
                    }
                }
            },
            'limit': limit,
            'orderBys': [{'metric': {'metricName': 'eventCount'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        providers = []
        for row in response.get('rows', []):
            provider_name = row['dimensionValues'][0]['value']
            if provider_name and provider_name != '(not set)':
                providers.append({
                    'provider': provider_name,
                    'clicks': int(row['metricValues'][0]['value']),
                    'users': int(row['metricValues'][1]['value'])
                })

        # Calculate totals
        total_clicks = sum(p['clicks'] for p in providers)
        total_users = sum(p['users'] for p in providers)

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_providers': len(providers),
            'total_clicks': total_clicks,
            'total_users': total_users,
            'providers': providers
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_corridor_performance(
    days: int = 14,
    limit: int = 20
) -> dict[str, Any]:
    """
    Get remittance corridor performance from Google Analytics 4.
    Tracks which currency corridors (e.g., KRW->PHP, KRW->VND) users are searching.

    Args:
        days: Number of days to look back (default: 14)
        limit: Maximum number of corridors to return (default: 20)

    Returns:
        Dictionary containing corridor performance data
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Query search_rates events with corridor parameter
        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [
                {'name': 'customEvent:corridor'}
            ],
            'metrics': [
                {'name': 'eventCount'},
                {'name': 'totalUsers'}
            ],
            'dimensionFilter': {
                'filter': {
                    'fieldName': 'eventName',
                    'stringFilter': {
                        'matchType': 'EXACT',
                        'value': 'search_rates'
                    }
                }
            },
            'limit': limit,
            'orderBys': [{'metric': {'metricName': 'eventCount'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        corridors = []
        for row in response.get('rows', []):
            corridor = row['dimensionValues'][0]['value']
            if corridor and corridor != '(not set)':
                corridors.append({
                    'corridor': corridor,
                    'searches': int(row['metricValues'][0]['value']),
                    'users': int(row['metricValues'][1]['value'])
                })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_corridors': len(corridors),
            'corridors': corridors
        }
    except Exception as e:
        return {'error': str(e)}


@mcp.tool()
def ga4_get_currency_events(
    days: int = 14
) -> dict[str, Any]:
    """
    Get currency selection events from Google Analytics 4.
    Tracks which currencies users are interested in for remittance.

    Args:
        days: Number of days to look back (default: 14)

    Returns:
        Dictionary containing currency selection data
    """
    try:
        service = get_ga4_service()
        property_id = os.getenv("GA4_PROPERTY_ID")

        if not property_id or property_id == "YOUR_GA4_PROPERTY_ID":
            return {'error': 'GA4_PROPERTY_ID not configured in .env file'}

        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Look for currency-related events
        request = {
            'dateRanges': [{
                'startDate': start_date.strftime('%Y-%m-%d'),
                'endDate': end_date.strftime('%Y-%m-%d')
            }],
            'dimensions': [
                {'name': 'eventName'},
                {'name': 'customEvent:currency'}  # Custom dimension for currency
            ],
            'metrics': [
                {'name': 'eventCount'}
            ],
            'dimensionFilter': {
                'filter': {
                    'fieldName': 'eventName',
                    'stringFilter': {
                        'matchType': 'CONTAINS',
                        'value': 'currency'
                    }
                }
            },
            'limit': 50,
            'orderBys': [{'metric': {'metricName': 'eventCount'}, 'desc': True}]
        }

        response = service.properties().runReport(
            property=f'properties/{property_id}',
            body=request
        ).execute()

        currencies = []
        for row in response.get('rows', []):
            currencies.append({
                'event': row['dimensionValues'][0]['value'],
                'currency': row['dimensionValues'][1]['value'] if len(row['dimensionValues']) > 1 else 'N/A',
                'count': int(row['metricValues'][0]['value'])
            })

        return {
            'period': f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            'total_entries': len(currencies),
            'currencies': currencies
        }
    except Exception as e:
        return {'error': str(e)}


# ============================================
# Combined Analysis Tools
# ============================================

@mcp.tool()
def get_content_insights(
    days: int = 7
) -> dict[str, Any]:
    """
    Get combined insights for content creation from both GSC and GA4.

    This tool provides actionable insights for blog content strategy by combining:
    - Top search queries (what users are searching for)
    - Page performance (which content is working)
    - Traffic patterns (user behavior)

    Args:
        days: Number of days to look back (default: 7)

    Returns:
        Dictionary containing combined insights for content strategy
    """
    insights = {
        'period': f"Last {days} days",
        'gsc_queries': None,
        'gsc_pages': None,
        'ga4_overview': None,
        'recommendations': []
    }

    # Get GSC data
    try:
        gsc_queries = gsc_get_search_queries(days=days, limit=10)
        insights['gsc_queries'] = gsc_queries
    except Exception as e:
        insights['gsc_queries'] = {'error': str(e)}

    try:
        gsc_pages = gsc_get_page_performance(days=days, limit=10)
        insights['gsc_pages'] = gsc_pages
    except Exception as e:
        insights['gsc_pages'] = {'error': str(e)}

    # Get GA4 data
    try:
        ga4_overview = ga4_get_traffic_overview(days=days)
        insights['ga4_overview'] = ga4_overview
    except Exception as e:
        insights['ga4_overview'] = {'error': str(e)}

    # Generate recommendations
    recommendations = []

    if insights['gsc_queries'] and 'queries' in insights['gsc_queries']:
        low_ctr_queries = [
            q for q in insights['gsc_queries']['queries']
            if q['impressions'] > 10 and q['ctr'] < 5
        ]
        if low_ctr_queries:
            recommendations.append({
                'type': 'meta_optimization',
                'message': f"Found {len(low_ctr_queries)} queries with high impressions but low CTR. Consider optimizing meta titles/descriptions.",
                'queries': [q['query'] for q in low_ctr_queries[:3]]
            })

    if insights['gsc_pages'] and 'pages' in insights['gsc_pages']:
        blog_pages = [p for p in insights['gsc_pages']['pages'] if '/blog' in p['page']]
        if blog_pages and blog_pages[0]['ctr'] < 3:
            recommendations.append({
                'type': 'blog_ctr',
                'message': "Blog CTR is below 3%. Consider A/B testing meta descriptions.",
                'current_ctr': blog_pages[0]['ctr']
            })

    insights['recommendations'] = recommendations

    return insights


if __name__ == "__main__":
    mcp.run()
