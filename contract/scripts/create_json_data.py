import os
from brownie import network, config, DappToken, BestiaToken, BestiaFaucet
import json
def create_context(bestia_token,dapp_token, bestia_faucet):
    bestia_token_abi = bestia_token.abi
    bestia_token_address = bestia_token.address
    dapp_token_abi = dapp_token.abi
    dapp_token_address = dapp_token.address
    erc20_abi = get_erc20_abi()

    context = {
        "bestia_token": {
            "abi":bestia_token_abi,
            "address": bestia_token_address
        },
        "dapp_token":{
            "abi":dapp_token_abi,
            "address": dapp_token_address
        },
        "bestia_faucet":{
            "abi":bestia_faucet.abi,
            "address": bestia_faucet.address
        },
        "erc20_abi": erc20_abi
    }
    return context
def get_erc20_abi():
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "build/contracts/dependencies/OpenZeppelin/openzeppelin-contracts@4.2.0/ERC20.json")
    with open(path,"r") as file:
        data = json.loads(file.read())
    return data["abi"]
def create_json_data(context):
    filename = "bestia_faucet_data.json"
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),'frontend','src')
    if os.path.exists(path):
        with open(os.path.join(path,filename),"w") as file:
            json.dump(context,file)
    return os.path.join(path,filename)

def main():
    dapptoken = DappToken[-1]
    bestiatoken = BestiaToken[-1]
    bestiafaucet = BestiaFaucet[-1]
    context = create_context(bestiatoken,dapptoken,bestiafaucet)
    create_json_data(context)