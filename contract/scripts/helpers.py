from brownie import network, accounts, config

LOCAL_DEVELOPEMENT_ENV = [
    "development","mainnet-fork"
]


def get_account(env_account = True):
    if network.show_active() in LOCAL_DEVELOPEMENT_ENV:
        account = accounts[0]
    else:
        if env_account:
            account = accounts.add(config['wallets']['from'])
        else:
            account = accounts.load("mainaddress")
    return account