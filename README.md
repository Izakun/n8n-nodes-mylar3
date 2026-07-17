# n8n-nodes-mylar3

[![npm version](https://img.shields.io/npm/v/n8n-nodes-mylar3.svg)](https://www.npmjs.com/package/n8n-nodes-mylar3)

n8n community node for [Mylar3](https://github.com/mylar3/mylar3) — the comics downloader/automation tool — via its API.

Install via **Settings -> Community Nodes -> Install** -> `n8n-nodes-mylar3`.

## Operations
- Get Index / Wanted / Version, Get Comic

## Credentials
Configure the base URL and authentication in the **Mylar3 API** credential.

## Usage example

Read the comic index:

1. Add the node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your credential.
3. **Get Index**.
4. Execute the node — example output:

```json
{ "ComicName": "Saga", "Status": "Active", "haveissues": 60, "totalissues": 66 }
```

## Disclaimer
Not affiliated with or endorsed by the respective project.
