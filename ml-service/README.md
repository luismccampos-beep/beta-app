# AKMLEVA ML Service

> **Last updated:** August 31, 2026

Machine Learning microservice for the AKMLEVA travel platform, providing AI-powered recommendations, personalization, and analytics.

## 🚀 Features

- **Travel Recommendations**: AI-powered destination and activity recommendations
- **Personalization Engine**: User preference learning and adaptive suggestions
- **Chat & Conversational AI**: Natural language travel assistance
- **Analytics & Insights**: Travel pattern analysis and predictions
- **Sustainability Scoring**: Environmental impact assessments
- **RAG Integration**: Knowledge base retrieval for enhanced responses

## 📁 Structure

> **Note on empty folders:** `ml-service/models/`, `ml-service/cache/` and `app/models/trained/` may appear empty in a fresh clone — trained artifacts (`*.pkl`) are gitignored (see `ml-service/.gitignore`) and the runtime cache is created on demand.
>
> - **`app/models/trained/`** — actual trained artifacts (`destination_embeddings.pkl`, `recommender.pkl`, `rag_index.pkl`). Regenerate with `npm run travel:ml:export` (repo root) then `npm run train:destinations` (this folder).
> - **`cache/`** — runtime cache (SCGraph geographic data, embedding caches). Populated automatically on first request.
> - **`models/` (root)** — legacy/optional location for `models/model.pkl` and the local TinyAya model (`models/tiny_aya`, downloaded manually).

```text
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

## 🗺️ Wikivoyage destination embeddings

Content-based ranking (TF-IDF + SVD) for travel preferences. Run from the **repo root**:

```bash
npm run travel:ml:export   # bundle-wikivoyage.json → app/data/wikivoyage_destinations.csv
npm run travel:ml:train    # trains destination_embeddings.pkl (~1 min for 12k items)
# or
npm run travel:ml:build
```

**API** (with `npm run dev`):

- `GET /v1/travel/rank/health` — model loaded?
- `POST /v1/travel/rank` — body: `{ "preferences": { ... }, "candidates": [{ "destino_id": 1, "iata": "LIS" }] }`
- `GET /v1/travel/distance/health` — SCGraph installed?
- `POST /v1/travel/distance` — road distance (km) between two lat/lon points
- `POST /v1/travel/distance/batch` — up to 50 destinations from one origin (for ranking)

Install SCGraph on Linux/Docker (first query downloads `world_highways`; ~1 GB cache):

```bash
pip install "scgraph>=3.1,<4"
# optional: ML_SERVICE_SCGRAPH_GEOGRAPH=world_highways
```

Without `scgraph`, endpoints still work using **haversine** fallback (straight-line km).

The TanStack Start web app blends embedding scores and **road proximity** (SCGraph) with rule-based matching when `ML_SERVICE_BASE_URL` is set.

### Route modules (`app/api/routes/`)

| Route | Purpose |
| --- | --- |
| `recommendations.py` | Destination recommendations |
| `travel_ranking.py` | `/v1/travel/rank` — embedding-based ranking |
| `travel_distance.py` | `/v1/travel/distance` + `/batch` — SCGraph/haversine road distance |
| `personalization.py` | User preference learning |
| `chat.py` | Conversational AI (TinyAya / Gemini) |
| `rag.py` | Retrieval-Augmented Generation |
| `predictions.py` | Travel pattern predictions |
| `xai.py` | Explainable AI (feature importance) |
| `unified.py` | Combined endpoints |
| `validate_image.py` | Image validation |

## 📊 API Documentation

Once running, visit:

- **Swagger UI**: <http://localhost:3002/docs>
- **ReDoc**: <http://localhost:3002/redoc>

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

# Web app integration
ML_SERVICE_BASE_URL=http://localhost:3002
```

> ⚠️ The dev server uses **port 3002**, the same as the web app. If running both locally, start the ML service on another port (e.g. `uvicorn app.main:app --port 8000`) and point `ML_SERVICE_BASE_URL` at it.

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

- **Documentation**: [docs.akmleva.com](https://docs.akmleva.com)
- **Issues**: [github.com/luismccampos-beep/beta-app/issues](https://github.com/luismccampos-beep/beta-app/issues)
- **Email**: [luismccampos@gmail.com](mailto:luismccampos@gmail.com)
