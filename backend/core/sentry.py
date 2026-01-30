"""Sentry integration for error tracking and performance monitoring."""

import structlog

from core.config import settings

logger = structlog.get_logger(__name__)


def init_sentry() -> bool:
    """
    Initialize Sentry SDK for error tracking and performance monitoring.

    Returns:
        True if Sentry was initialized, False otherwise.
    """
    if not settings.sentry_dsn:
        logger.info("sentry_disabled", reason="No SENTRY_DSN configured")
        return False

    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.starlette import StarletteIntegration

        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.env,
            traces_sample_rate=settings.sentry_traces_sample_rate,
            profiles_sample_rate=settings.sentry_profiles_sample_rate,
            integrations=[
                FastApiIntegration(transaction_style="endpoint"),
                StarletteIntegration(transaction_style="endpoint"),
            ],
            # Don't send PII
            send_default_pii=False,
            # Set release version
            release=f"remitbuddy-api@{settings.api_version}",
            # Filter out noisy errors
            before_send=_before_send,
        )

        logger.info(
            "sentry_initialized",
            environment=settings.env,
            traces_sample_rate=settings.sentry_traces_sample_rate,
        )
        return True

    except ImportError:
        logger.warning("sentry_not_installed", message="sentry-sdk not installed")
        return False
    except Exception as e:
        logger.error("sentry_init_failed", error=str(e))
        return False


def _before_send(event, hint):
    """
    Filter events before sending to Sentry.

    This can be used to:
    - Remove sensitive data
    - Filter out noisy errors
    - Add custom tags
    """
    # Filter out expected errors
    if "exc_info" in hint:
        exc_type, exc_value, _ = hint["exc_info"]
        exc_name = exc_type.__name__

        # Don't send rate limit errors
        if exc_name == "RateLimitExceeded":
            return None

        # Don't send expected validation errors
        if exc_name in ("ValidationError", "RequestValidationError"):
            return None

    return event


def capture_exception(error: Exception, **extra) -> None:
    """
    Capture an exception to Sentry with additional context.

    Args:
        error: The exception to capture
        **extra: Additional context to include
    """
    if not settings.sentry_dsn:
        return

    try:
        import sentry_sdk
        with sentry_sdk.push_scope() as scope:
            for key, value in extra.items():
                scope.set_extra(key, value)
            sentry_sdk.capture_exception(error)
    except ImportError:
        pass
    except Exception as e:
        logger.warning("sentry_capture_failed", error=str(e))


def capture_message(message: str, level: str = "info", **extra) -> None:
    """
    Capture a message to Sentry.

    Args:
        message: The message to capture
        level: Log level (info, warning, error)
        **extra: Additional context to include
    """
    if not settings.sentry_dsn:
        return

    try:
        import sentry_sdk
        with sentry_sdk.push_scope() as scope:
            for key, value in extra.items():
                scope.set_extra(key, value)
            sentry_sdk.capture_message(message, level=level)
    except ImportError:
        pass
    except Exception as e:
        logger.warning("sentry_capture_failed", error=str(e))
