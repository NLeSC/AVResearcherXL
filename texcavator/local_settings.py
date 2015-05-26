# The following file contains example settings for an AVResearcherXL instance
# connected to an Elasticsearch holding data for Texcavator.
# The format of ES documents is the one documented at
# https://github.com/UUDigitalHumanitieslab/texcavator#preparing-the-data
import certifi

DEBUG = False

SECRET_KEY = ''

LOGIN_DISABLED = True

# URL of the ElasticSearch instance that contains the AVResearcherXL indexes
ES_SEARCH_CONFIG = {'hosts': [],
                    'http_auth': ('username', 'SECRETPASSWORD'),
                    'port': 443, 'use_ssl': True,
                    'verify_certs': True, 'ca_certs': certifi.where()}

# URL of the ElasticSearch instance used to store usage logs (clicks,
# queries, etc.)
ES_LOG_CONFIG = {'hosts': [],
                 'http_auth': ('username', 'SECRETPASSWORD'),
                 'port': 443, 'use_ssl': True,
                 'verify_certs': True, 'ca_certs': certifi.where()}
ES_LOG_INDEX = 'test_logs'

# User database URI
SQLALCHEMY_DATABASE_URI = 'sqlite:///avresearcher.db'

# Sentry DNS; when ``False`` Sentry won't be used
SENTRY_DSN = False

COLLECTIONS_CONFIG = {
    'kb': {
        'name': 'KB kranten',
        'index_name': 'kb',
        'enabled_facets': [
            #'descriptive_terms',
            #'publication',
            'article_type',
        ],
        'required_fields': [
            'article_dc_title',
            'paper_dc_date',
            'paper_dc_title',
            'article_dc_identifier_resolver',
        ],
        'date_sort_field': 'paper_dc_date',
        'available_aggregations': {
            'dates_stats': {
                'stats': {'field': 'paper_dc_date'}
            },
            'dates': {
                'date_histogram': {
                    'field': 'paper_dc_date',
                    'interval': 'year',
                    'min_doc_count': 0,
                }
            },
            'descriptive_terms': {
                'name': 'Descriptive terms',
                'description': '',
                'significant_terms': {
                    'field': 'article_dc_title',
                    'size': 15,
                    'min_doc_count': 10,
                }
            },
            'article_type': {
                'name': 'Article type',
                'description': '',
                'terms': {
                    'field': 'article_dc_subject',
                    'size': 15
                }
            },
            'publication': {
                'name': 'Publication',
                'description': '',
                'terms': {
                    'field': 'paper_dc_title',
                    'size': 15
                }
            },
            #'descriptive_terms_text': {
            #    'name': 'Words',
            #    'description': '',
            #    'terms': {
            #        'field': 'meta.text_descriptive_terms',
            #        'size': 30
            #    }
            #}
        },
        'enabled_search_fields': ['article_dc_title', 'text_content'],
        'available_search_fields': {
            'article_dc_title': {
                'name': 'KB article title',
                'fields': ['article_dc_title']
            },
            'text_content': {
                'name': 'KB article text',
                'fields': ['text_content']
            }
        }
    }
}

ENABLED_COLLECTIONS = ['kb']

HITS_PER_PAGE = 5
ALLOWED_INTERVALS = ['year', 'month', 'week', 'day']

# The facet that is used for the date range slider
DATE_AGGREGATION = 'dates'
DATE_STATS_AGGREGATION = 'dates_stats'

MINIMUM_CLOUD_FONTSIZE = 10
MAXIMUM_CLOUD_FONTSIZE = 30

BARCHART_BARS = 10
BARCHART_BAR_HEIGHT = 20

# The fields that should be considered when creating highlighted snippets for
# a search result.
HIT_HIGHLIGHT_FIELDS = ['text_content', 'article_dc_title']
# The max. length of a highlighted snippet (in chars)
HIT_HIGHLIGHT_FRAGMENT_SIZE = 200
# The max. number of highlighted snippets (per field) to return
HIT_HIGHLIGHT_FRAGMENTS = 1

# Enables or disables application usage logging
ENABLE_USAGE_LOGGING = True

LOG_EVENTS = ['clicks', 'results']
