import { Button, Card, Tabs, Spin } from "antd";
import { useState, useEffect } from "react";
import { useOnLoadRequest, useRequestToken } from "../../hooks/requestHooks";

const RequestForm = ({address, name})=>{
    const {request, requestState, requestLoading} = useRequestToken(address);
    const onRequest = ()=>{
        request()
    }
    return (<>
    <div style={{minHeight: 200, display:"flex",justifyContent:"center", alignItems:"center"}}>
        <Button type="primary" onClick={onRequest} loading={requestLoading}>
            Request {name}
        </Button>
    </div>
  </>);
}


const Request = ({account}) => {
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
                        children: <RequestForm address={value[0][idx]} name={tokenNames[idx]} />,
                    }
                )
            }
            setTabItems(arrayOfData);
            setPageLoading(false);

        }
    },[value, tokenNames])
    return (
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
    );
}
 
export default Request;