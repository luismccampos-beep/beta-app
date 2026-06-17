import httpx, json

url = "https://mcp.tavily.com/mcp/?tavilyApiKey=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"
model = "eepSeek-Coder-V2-Lite-Instruct"

methods = ["inference","infer","predict","model.predict","model.infer","invoke","call","request","run","model.invoke","predict.inference"]
param_variants = [
    {"inputs": "test", "model": model, "parameters": {"max_new_tokens": 1}},
    {"input": "test", "model": model, "parameters": {"max_new_tokens": 1}},
    {"text": "test", "model": model},
    {"request": {"inputs": "test"}, "model": model},
    {"data": "test", "model": model},
]

headers = {"Content-Type": "application/json", "Accept": "application/json, text/event-stream"}

with httpx.Client(timeout=30.0) as client:
    for m in methods:
        for p in param_variants:
            payload = {"jsonrpc": "2.0", "id": f"probe-{m}", "method": m, "params": p}
            r = client.post(url, json=payload, headers=headers)
            print("METHOD:", m, "PARAMS:", list(p.keys()), "STATUS:", r.status_code)
            txt = r.text.strip()
            if len(txt) > 400:
                print(txt[:400])
            else:
                print(txt)
            print("---")
