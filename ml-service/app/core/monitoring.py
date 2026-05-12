try:
    from prometheus_client import Counter, Gauge, start_http_server  # type: ignore
except ImportError:
    import warnings
    warnings.warn("prometheus_client not installed; metrics will be disabled", ImportWarning)
    # Provide dummy implementations so the rest of the file can import without errors
    class Counter:
        def __init__(self, *args, **kwargs): pass
        def inc(self, *args, **kwargs): pass
        def labels(self, *args, **kwargs): return self
    class Gauge:
        def __init__(self, *args, **kwargs): pass
        def set(self, *args, **kwargs): pass
        def labels(self, *args, **kwargs): return self
    def start_http_server(*args, **kwargs): pass
from app.core.config import settings

# Create metrics
PREDICTION_LATENCY = Counter(
    "model_prediction_count", "Number of predictions made"
)

PREDICTION_LATENCY_HISTOGRAM = Counter(
    "model_prediction_latency_seconds",
    "Histogram of prediction latencies"
)

REQUEST_COUNT = Counter(
    "api_request_count",
    "Total number of API requests",
    ["endpoint"]
)

ERROR_COUNT = Counter(
    "api_error_count",
    "Total number of API errors",
    ["endpoint", "status"]
)

MODEL_LOAD_TIME = Gauge(
    "model_load_time_seconds",
    "Time taken to load models"
)

def init_monitoring():
    """Initialize monitoring and metrics"""
    if settings.MONITORING_ENABLED:
        start_http_server(settings.PROMETHEUS_PORT)
        print(f"Monitoring initialized. Prometheus endpoint at http://localhost:{settings.PROMETHEUS_PORT}/metrics")
    else:
        warnings.warn("Monitoring is disabled")
