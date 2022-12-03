from web3 import Web3
import requests
import argparse
import json

def args():
    
    parser = argparse.ArgumentParser(description='Deploy')

    parser.add_argument('private_key', type=str, help='account deploy contract')
    parser.add_argument('rps', type=str, help='rps network')
    parser.add_argument('contract_address', type=str, help='contract address')

    return parser.parse_args()

if __name__ == '__main__':
    arg = args()
    
    web3 = Web3(Web3.HTTPProvider(arg.rps))
    contract_address = arg.contract_address

    with open('solidity/ABI.json', 'r') as f:
        abi = json.load(f)
    
    private_key = arg.private_key
    account = web3.eth.account.from_key(private_key)
    contract = web3.eth.contract(contract_address, abi=abi)

    r = requests.get('http://localhost:1337/api/records')
    data = json.loads(r.text)

    addrlist = []
    for msg in data['data']:
        wallets = msg['attributes']['wallets'].split(',')
        for wallet in wallets:
            addrlist.append(wallet)
        
    tx = contract.functions.safeMint(
        addrlist,
        'https://gateway.pinata.cloud/ipfs/QmYusa1LMAq37ffc7q6cy4uboNZ3TftiQct4UkuE98nWXW'
    ).build_transaction({'from': account.address})
    tx['nonce'] = web3.eth.get_transaction_count(account.address)
    
    signed_txn = web3.eth.account.sign_transaction(tx, private_key)
    hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    receipt = web3.eth.wait_for_transaction_receipt(hash, 60*5)
    
    if receipt['status'] == 0:
        print(f"Error Tx: {receipt['transactionHash'].hex()}")
    else:
        for wallet in addrlist:
            print(f"safeMint: {wallet}")
