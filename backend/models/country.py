"""Country code mappings for all providers."""

from typing import Dict

# Standard ISO country codes
COUNTRY_CODES: Dict[str, str] = {
    "vietnam": "VN",
    "philippines": "PH",
    "indonesia": "ID",
    "cambodia": "KH",
    "nepal": "NP",
    "myanmar": "MM",
    "thailand": "TH",
    "uzbekistan": "UZ",
    "srilanka": "LK",
    "bangladesh": "BD",
    "mongolia": "MN",
    "united states": "US",
    "unitedstates": "US",
    "canada": "CA",
    "singapore": "SG",
    "china": "CN",
    "malaysia": "MY",
    "japan": "JP",
    "hong kong": "HK",
    "hongkong": "HK",
    "united kingdom": "GB",
    "unitedkingdom": "GB",
}

# SentBe country IDs (reference only, not active provider)
SENTBE_COUNTRY_CODES: Dict[str, int] = {
    "vietnam": 209,
    "philippines": 154,
    "indonesia": 92,
    "nepal": 139,
    "thailand": 194,
    "cambodia": 35,
    "myanmar": 134,
    "uzbekistan": 205,
    "srilanka": 189,
    "bangladesh": 17,
    "mongolia": 132,
}

# GMoney Trans country names
GMONEY_COUNTRY_NAMES: Dict[str, str] = {
    "vietnam": "Viet Nam",
    "philippines": "Philippines",
    "indonesia": "Indonesia",
    "cambodia": "Cambodia",
    "nepal": "Nepal",
    "myanmar": "Myanmar",
    "thailand": "Thailand",
    "uzbekistan": "Uzbekistan",
    "srilanka": "Sri Lanka",
    "bangladesh": "Bangladesh",
    "mongolia": "Mongolia",
    "united states": "United States",
    "unitedstates": "United States",
    "canada": "Canada",
    "hong kong": "Hong Kong",
    "hongkong": "Hong Kong",
    "japan": "Japan",
    "united kingdom": "United Kingdom",
    "unitedkingdom": "United Kingdom",
    "singapore": "Singapore",
    "china": "China",
    "malaysia": "Malaysia",
}

# GMoney payment types per country
GMONEY_PAYMENT_TYPES: Dict[str, str] = {
    "uzbekistan": "Humocard",
    "default": "Bank Account",
}

# E9Pay receiver codes
E9PAY_RECV_CODES: Dict[str, str] = {
    "vietnam": "VN03",
    "philippines": "PH15",
    "indonesia": "ID01",
    "thailand": "TH03",
    "nepal": "NP",
    "myanmar": "MM01",
    "uzbekistan": "UZ15",
    "srilanka": "LK03",
    "bangladesh": "BD01",
    "united states": "US01",
    "unitedstates": "US01",
    "canada": "CA01",
    "china": "CN09",
    "malaysia": "MY01",
    "japan": "JP02",
    "hong kong": "HK01",
    "hongkong": "HK01",
    "united kingdom": "GB01",
    "unitedkingdom": "GB01",
    "mongolia": "MN03",
}

# Coinshot currency mapping
COINSHOT_CURRENCIES: Dict[str, str] = {
    "vietnam": "VND",
    "philippines": "PHP",
    "indonesia": "IDR",
    "thailand": "THB",
    "nepal": "NPR",
    "myanmar": "MMK",
    "uzbekistan": "UZS",
    "srilanka": "LKR",
    "bangladesh": "BDT",
    "cambodia": "KHR",
    "mongolia": "MNT",
    "united states": "USD",
    "unitedstates": "USD",
    "canada": "CAD",
    "singapore": "SGD",
    "china": "CNY",
    "malaysia": "MYR",
    "japan": "JPY",
    "hong kong": "HKD",
    "hongkong": "HKD",
    "united kingdom": "GBP",
    "unitedkingdom": "GBP",
}

# GME Remit country names
GMEREMIT_COUNTRY_NAMES: Dict[str, str] = {
    "vietnam": "Vietnam",
    "philippines": "Philippines",
    "indonesia": "Indonesia",
    "thailand": "Thailand",
    "nepal": "Nepal",
    "myanmar": "Myanmar",
    "uzbekistan": "Uzbekistan",
    "srilanka": "Sri Lanka",
    "bangladesh": "Bangladesh",
    "cambodia": "Cambodia",
    "mongolia": "Mongolia",
    "united states": "United States",
    "unitedstates": "United States",
    "canada": "Canada",
    "singapore": "Singapore",
    "china": "China",
    "malaysia": "Malaysia",
    "japan": "Japan",
    "hong kong": "Hong Kong",
    "hongkong": "Hong Kong",
    "united kingdom": "United kingdom",
    "unitedkingdom": "United kingdom",
}

# GME Remit delivery methods by country
GMEREMIT_DELIVERY_METHODS: Dict[str, str] = {
    "vietnam": "2",
    "philippines": "2",
    "indonesia": "2",
    "thailand": "2",
    "nepal": "2",
    "myanmar": "2",
    "uzbekistan": "1",
    "srilanka": "2",
    "bangladesh": "2",
    "cambodia": "2",
    "mongolia": "2",
    "united states": "1",
    "unitedstates": "1",
    "canada": "2",
    "singapore": "2",
    "china": "2",
    "malaysia": "2",
    "japan": "2",
    "hong kong": "2",
    "hongkong": "2",
    "united kingdom": "2",
    "unitedkingdom": "2",
}

# JP Remit currency mapping
JPREMIT_CURRENCIES: Dict[str, str] = {
    "vietnam": "VND",
    "philippines": "PHP",
    "indonesia": "IDR",
    "thailand": "THB",
    "nepal": "NPR",
    "myanmar": "MMK",
    "uzbekistan": "UZS",
    "srilanka": "LKR",
    "bangladesh": "BDT",
    "cambodia": "KHR",
    "mongolia": "MNT",
    "china": "CNY",
    "japan": "JPY",
}

# The Moin country codes
THEMOIN_COUNTRY_CODES: Dict[str, str] = {
    "japan": "JP",
    "thailand": "TH",
    "united states": "US",
    "unitedstates": "US",
    "canada": "CA",
    "singapore": "SG",
    "china": "CN",
    "malaysia": "MY",
    "hong kong": "HK",
    "hongkong": "HK",
    "united kingdom": "GB",
    "unitedkingdom": "GB",
}

# The Moin currencies
THEMOIN_CURRENCIES: Dict[str, str] = {
    "japan": "JPY",
    "thailand": "THB",
    "united states": "USD",
    "unitedstates": "USD",
    "canada": "CAD",
    "singapore": "SGD",
    "china": "CNY",
    "malaysia": "MYR",
    "hong kong": "HKD",
    "hongkong": "HKD",
    "united kingdom": "GBP",
    "unitedkingdom": "GBP",
}

# Airwallex supported currencies (KRW to foreign currency)
AIRWALLEX_CURRENCIES: Dict[str, str] = {
    "vietnam": "VND",
    "philippines": "PHP",
    "nepal": "NPR",
    "thailand": "THB",
    "singapore": "SGD",
    "united states": "USD",
    "unitedstates": "USD",
    "japan": "JPY",
    "hong kong": "HKD",
    "hongkong": "HKD",
    "china": "CNY",
    "united kingdom": "GBP",
    "unitedkingdom": "GBP",
    "indonesia": "IDR",
    "malaysia": "MYR",
    "bangladesh": "BDT",
}

