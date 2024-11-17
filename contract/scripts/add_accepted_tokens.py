from brownie import network, DappToken, BestiaToken, BestiaFaucet
from scripts.helpers import get_account, LOCAL_DEVELOPEMENT_ENV
from web3 import Web3
def add_accepted_tokens():
    """
    This will interact with the addAcceptedToken function of the BestiaFaucet Contract
    Steps:
    - get or deploy dapptoken and bestiatoken
    - add address to addAcceptedToken function of the BestiaFaucet Contract
    - show acceptedTokens list from BestiaFaucet Contract
    """
    print("Add Accepted Tokens Program".center(20,"-"))
    account = get_account()
    tokens_contract = []

    
    if len(BestiaFaucet) == 0:
        print("Deploying Tokens and Contract")
        from scripts.deploy import deploy
        tokens = deploy()
        tokens = list(tokens)
        bestiafaucet = tokens.pop()
        tokens_contract.extend(tokens)
    else:
        dapptoken = DappToken[-1]
        bestiatoken = BestiaToken[-1]
        bestiafaucet = BestiaFaucet[-1]
        tokens_contract.extend([dapptoken,bestiatoken])
    for token in tokens_contract:
        print(f"Adding {token.address} token address to accepted token addresses of BestiaFaucet")
        tx = bestiafaucet.addAcceptedToken(token.address,Web3.toWei(10,"ether"),{"from":account})
        tx.wait(1)
        print(f"{token.address} token address added")
    
    print("Showing List of Accepted token addresses")
    print(bestiafaucet.getAcceptedTokens())

def main():
    add_accepted_tokens()