import requests
key = '13f52573-9c49-42b3-b4c6-0eeb3e93ec3b'
headers = {
    'Accept': 'application/json',
    'Api_Key': key
}
resp = requests.get('https://api.cricapi.com/v1/currentMatches', headers=headers, params={'offset': 0}, timeout=15)
print('Status:', resp.status_code)
data = resp.json()
print('Response:', data)