from app.pipelines.recommender import train_and_save

if __name__ == "__main__":
    config = {
        "interactions_path": "app/data/interactions.csv",
        "items_path": "app/data/items.csv",
        "k": 32,
        "out_path": "app/models/trained/recommender.pkl",
    }
    out = train_and_save(config)
    print(f"Model saved at {out}")