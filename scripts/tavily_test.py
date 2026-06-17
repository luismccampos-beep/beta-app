import httpx, json

url = "https://mcp.tavily.com/mcp/?tavilyApiKey=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"
payload = {
    "jsonrpc": "2.0",
    "id": "1",
    "method": "model.predict",
    "params": {
        "inputs": "test",
        "model": "eepSeek-Coder-V2-Lite-Instruct",
        "parameters": {"max_new_tokens": 1},
    },
}
headers = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}

with httpx.Client(timeout=30.0) as client:
    r = client.post(url, json=payload, headers=headers)
    print(r.status_code)
    try:
        print(r.json())
    except Exception:
        print(r.text)
