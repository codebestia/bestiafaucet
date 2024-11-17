from brownie import DappToken, BestiaToken, BestiaFaucet
from scripts.helpers import get_account
from scripts.add_accepted_tokens import add_accepted_tokens
from web3 import Web3
def deploy():
    """
    Deploying DappToken,BestiaToken, BestiaFaucet
    Steps:
    - get account
    - deploy tokens
    - deploy contract
    - add tokens to accepted contract tokens
    - return tokens and contract
    """
    print("Deploy Program")
    account = get_account()
    print("Deploying DappToken")
    dapptoken = DappToken.deploy(Web3.toWei(100000000000,"ether"),{"from":account})
    print("DappToken deployed at",dapptoken.address)
    print("Deploying BestiaToken")
    bestiatoken = BestiaToken.deploy(Web3.toWei(100000000000,"ether"),{"from":account})
    print("BestiaToken deployed at",bestiatoken.address)
    print("Deploying BestiaFaucet")
    bestiafaucet = BestiaFaucet.deploy({"from":account})
    print("BestiaFaucet deployed at", bestiafaucet.address)
    print("All tokens deployed")
    print("Add all tokens to BestiaFaucet accepted token")
    add_accepted_tokens()
    
def main():
    deploy()