# AKMLEVA ML Service

Machine Learning microservice for the AKMLEVA travel platform, providing AI-powered recommendations, personalization, and analytics.

## 🚀 Features

- **Travel Recommendations**: AI-powered destination and activity recommendations
- **Personalization Engine**: User preference learning and adaptive suggestions
- **Chat & Conversational AI**: Natural language travel assistance
- **Analytics & Insights**: Travel pattern analysis and predictions
- **Sustainability Scoring**: Environmental impact assessments
- **RAG Integration**: Knowledge base retrieval for enhanced responses

## 📁 Structure

```
ml-service/
├── app/
│   ├── api/              # API routes and endpoints
│   ├── core/             # Core configuration and utilities
│   ├── data/             # Data files and datasets
│   ├── ml/               # Machine learning models and services
│   ├── models/           # Model definitions and loaders
│   ├── pipelines/        # Data processing pipelines
│   ├── requirements/     # Python requirements files
│   └── main.py          # FastAPI application entry point
├── tests/                # Test suite
├── .venv/               # Python virtual environment
├── Dockerfile           # Docker configuration
├── package.json         # Node.js-style package configuration
├── pyproject.toml      # Python project configuration
└── README.md           # This file
```

## 🛠️ Installation

### Prerequisites
- Python 3.10+
- Node.js (for package.json scripts)

### Setup

1. **Clone and navigate**:
   ```bash
   cd ml-service
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   npm run install:dev  # Installs Python dev dependencies
   # or
   pip install -e .[dev]
   ```

## 🚦 Development

### Start Development Server
```bash
npm run dev
# or
uvicorn app.main:app --host 0.0.0.0 --port 3002 --reload
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run lint` - Run linting
- `npm run format` - Format code with black
- `npm run type-check` - Run type checking with mypy
- `npm run build` - Build package for distribution

## 🐳 Docker

### Build and Run
```bash
npm run docker:build
npm run docker:run
```

### Manual Docker Commands
```bash
docker build -t akmleva/ml-service .
docker run -p 3002:3002 akmleva/ml-service
```

## 📊 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:3002/docs
- **ReDoc**: http://localhost:3002/redoc

## 🔧 Configuration

Environment variables (create `.env`):
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=3002
DEBUG=true

# Database (optional)
DATABASE_URL=postgresql://user:pass@localhost:5432/akmleva_ml

# Redis Cache (optional)
REDIS_URL=redis://localhost:6379

# External APIs
OPENAI_API_KEY=your_openai_key
AMADEUS_API_KEY=your_amadeus_key
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test categories
pytest tests/ -m unit
pytest tests/ -m integration
```

## 📈 Monitoring

The service includes built-in monitoring capabilities:
- **Health checks**: `/health`, `/ready`
- **Metrics**: `/metrics` (Prometheus format)
- **Logging**: Structured JSON logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: https://docs.akmleva.com
- **Issues**: https://github.com/akmleva/akmleva/issues
- **Email**: dev@akmleva.com
