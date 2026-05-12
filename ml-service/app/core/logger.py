import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
from app.core.config import settings
from datetime import datetime

# Create logs directory if it doesn't exist
Path("logs").mkdir(exist_ok=True)

# Configure global logging
def setup_logging():
    # Create logger
    logger = logging.getLogger(__name__)
    logger.setLevel(settings.LOG_LEVEL)

    # Create formatter
    formatter = logging.Formatter(settings.LOG_FORMAT)

    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(settings.LOG_LEVEL)
    console_handler.setFormatter(formatter)

    # Create file handler
    file_handler = RotatingFileHandler(
        f"logs/{settings.APP_NAME}-{datetime.now().strftime('%Y-%m-%d')}.log",
        maxBytes=1024 * 1024 * 10,  # 10MB
        backupCount=5,
    )
    file_handler.setLevel(settings.LOG_LEVEL)
    file_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    # Set root logger level to WARNING
    logging.getLogger().setLevel(logging.WARNING)

    return logger

# Initialize logger
logger = setup_logging()