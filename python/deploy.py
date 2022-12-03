from web3 import Web3
import argparse
import json

def args():
    
    parser = argparse.ArgumentParser(description='Deploy')

    parser.add_argument('private_key', type=str, help='account deploy contract')
    parser.add_argument('rps', type=str, help='rps network')

    return parser.parse_args()

if __name__ == '__main__':
    arg = args()
    
    web3 = Web3(Web3.HTTPProvider(arg.rps))
    
    private_key = arg.private_key
    account = web3.eth.account.from_key(private_key)

    with open('solidity/ABI.json', 'r') as f:
        abi = json.load(f)

    with open('solidity/BYTECODE.json', 'r') as f:
        bin = json.load(f)['object']
    
    sbt = web3.eth.contract(abi=abi, bytecode=bin)

    tx = sbt.constructor().build_transaction()
    tx['nonce'] = web3.eth.get_transaction_count(account.address)
    tx['gas'] =  3000000

    signed_txn = web3.eth.account.sign_transaction(tx, private_key)
    hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

    receipt = web3.eth.wait_for_transaction_receipt(hash, 60*5)

    if receipt['status'] == 0:
        print(f"Error Tx: {receipt['transactionHash'].hex()}")
    else:
        print(f"Contract Address: {receipt['contractAddress']}")