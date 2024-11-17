import { useEffect, useState } from "react";
import { Spin, Card, Tabs, Button, Input } from "antd";
import { useRequestToken, useOnLoadRequest, useDepositToken } from "../../hooks/requestHooks";
import { parseEther } from "ethers/lib/utils";

const DepositForm = ({address, name})=>{
    const [depositAmount, setDepositAmount] = useState(0)
    const {approveDeposit, depositLoading} = useDepositToken(address);
    const onDeposit = ()=>{
        approveDeposit(parseEther(depositAmount.toString()))
    }
    return (<>
    <div style={{minHeight: 200, display:"flex",justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
        <Input value={depositAmount} 
        onChange={(e)=>setDepositAmount(parseFloat(e.target.value))} 
        type="number" 
        required 
        style={{marginBottom: 10}}
        />
        <Button type="primary" onClick={onDeposit} loading={depositLoading}>
            Deposit {name}
        </Button>
    </div>
  </>);
}


const Deposit = ({account}) => {
    const [tabItems, setTabItems] = useState([]);
    const [pageLoading, setPageLoading] = useState(true)
    const onLoad = async ()=>{
        
    }
    const {value,tokenNames} = useOnLoadRequest()
    useEffect(()=>{
        if(value !== undefined && tokenNames.length > 0){
            let arrayOfData = []
            for(let idx = 0; idx < tokenNames.length; idx++){
                arrayOfData.push(
                    {
                        key:`${idx + 1}`,
                        label:`${tokenNames[idx]}`,
                        children: <DepositForm address={value[0][idx]} name={tokenNames[idx]} />,
                    }
                )
            }
            setTabItems(arrayOfData);
            setPageLoading(false);

        }
    },[value, tokenNames])
    return (
        <>
        <div className="container">
            <Card className="card-container">
                {pageLoading?(
                    <div style={{minHeight: 200, display:"flex",justifyContent:"center", alignItems:"center"}}>
                        <Spin size="large" />
                    </div>
                ):(
                    <Tabs defaultActiveKey="1" centered items={tabItems} />
                )}
            </Card>
        </div>
        </>
       
       
    );
}
 
export default Deposit;