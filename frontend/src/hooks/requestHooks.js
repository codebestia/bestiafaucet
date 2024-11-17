import { useCallback, useEffect, useState } from "react"
import { useCall, useContractFunction } from "@usedapp/core";
import { constants, utils, Contract, Signer, providers } from "ethers";
import bestia_faucet_data from "../bestia_faucet_data.json";
import { message } from "antd";
import { SEPOLIA_PROVIDER } from "../providers";


const bestiaFaucetAbi = bestia_faucet_data.bestia_faucet.abi;
const bestiaFaucetAddress = bestia_faucet_data.bestia_faucet.address;
const bestiaFaucetInterface = new utils.Interface(bestiaFaucetAbi);
const bestiaFaucetContract = new Contract(bestiaFaucetAddress,bestiaFaucetInterface);
const erc20Abi = bestia_faucet_data.erc20_abi;
const erc20Interface = new utils.Interface(erc20Abi);

export const useOnLoadRequest = ()=>{
    const provider = new providers.JsonRpcProvider(SEPOLIA_PROVIDER) 
    
    const [tokenNames, setTokenNames] = useState([]);
    // const Contract = new Contract(,erc20Interface);
    const {value, error} = useCall({
        contract: bestiaFaucetContract,
        method: "getAcceptedTokens",
        args: []
    }) ?? {}
    
    if(error){
        message.error("Error getting contract tokens")
    }
    const getTokenNames = async(token)=>{
        let contract = new Contract(token,erc20Interface, provider)
        let tokenName = await contract.name();
        setTokenNames((prevState)=>{
            if(!prevState.includes(tokenName)){
                return [...prevState, tokenName]
            }
            return prevState
        })
    }
    useEffect(()=>{
        if(value !== undefined){
            for(let token of value[0]){
                console.log(token)
                getTokenNames(token)
            }
        }
    },[value])

    return {value,tokenNames}
    
}

export const useRequestToken =(address)=>{
    const [requestLoading, setRequestLoading] = useState(false);
    const {send: requestSend, state: requestState} = useContractFunction(bestiaFaucetContract,"request",
    {transactionName:"Request Faucet"});
    const request =()=>{
        setRequestLoading(true);
        return requestSend(address);
    }
    useEffect(()=>{
        if(requestState.status == "Success" || requestState.status == "Fail" || requestState.status == "Exception"){
            if(requestState.status == "Fail"){
                message.error(requestState.errorMessage)
            }
            if(requestState.status == "Exception"){
                message.error(requestState.errorMessage)
            }
            if(requestState.status == "Success"){
                message.success("Request Successful")
            }
            setRequestLoading(false)
        }
    },[requestState])
    return {request,requestState, requestLoading}
}

export const useDepositToken =(address)=>{
    const [depositAmount, setDepositAmount] = useState(null);
    const [depositLoading, setDepositLoading] = useState(false);
    const {send: depositSend, state: depositState} = useContractFunction(bestiaFaucetContract,"deposit",
    {transactionName:"deposit Faucet"});
    
    const erc20Contract = new Contract(address,erc20Interface)
    const {send: approveErc20Send, state: approveErc20State} = useContractFunction(erc20Contract,"approve",
    {transactionName:"Approve ERC20 transfer"});
  

    const approveDeposit = (amount)=>{
        setDepositAmount(amount);
        setDepositLoading(true);
        return approveErc20Send(bestiaFaucetAddress,amount);
    }
    const deposit =()=>{
        
        return depositSend(address, depositAmount);
    }
    useEffect(()=>{
        if(approveErc20State.status == "Success"){
            deposit()
        }
        if(approveErc20State.status == "Fail"){
            message.error(approveErc20State.errorMessage)
            setDepositLoading(false)
        }
        if(approveErc20State.status == "Exception"){
            message.error(approveErc20State.errorMessage)
            setDepositLoading(false)
        }
    },[approveErc20State])
    useEffect(()=>{
        if(depositState.status == "Success" || depositState.status == "Fail" || depositState.status == "Exception"){
            if(depositState.status == "Fail"){
                message.error(depositState.errorMessage)
            }
            if(depositState.status == "Exception"){
                message.error(depositState.errorMessage)
            }
            if(depositState.status == "Success"){
                message.success("Deposit Successful")
            }
            setDepositLoading(false)
        }
    },[depositState])
    return {approveDeposit,depositState, depositLoading}
}