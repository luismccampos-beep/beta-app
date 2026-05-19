from app.pipelines.train_destination_embeddings import train

if __name__ == "__main__":
    out = train()
    print(f"Model saved at {out}")
