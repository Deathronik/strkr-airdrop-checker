import './App.css';
import {Form, Table, Button, Spinner} from "react-bootstrap";
import React, {useState} from "react";
import Result from "./Components/Result/Result";
import Creator from "./Components/Creator/Creator";

function App() {
    const [wallets, setWallets] = useState([])
    const [results, setResults] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const onCLickCheckHandler = async () => {
        setIsLoading(true)
        const walletsStats = []
        let total = 0

        for (const wallet of wallets) {
            if (wallet === "") continue

            const response = await fetch(`https://starkrocket.xyz/api/check_wallet?address=${wallet}`, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7,uk;q=0.6",
                    "cache-control": "max-age=0",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "none",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "omit"
            });

            const responseJSON = await response.json()

            total += responseJSON.result.points

            walletsStats.push({
                wallet: responseJSON.result.address,
                amount: responseJSON.result.points,
                eligible: responseJSON.result.eligible
            })
        }

        setTotal(total)
        setResults(walletsStats)
        setIsLoading(false)
    }

    return (
        <div className="App p-5 d-flex justify-content-center align-items-center text-center flex-column">
            <h3>$STRKR Airdrop Checker</h3>
            <div>
                <Form className="mb-3">
                    <Form.Label className="text-white"><h5>Wallets</h5></Form.Label>
                    <Form.Control onChange={e => setWallets(e.target.value.toLowerCase().split("\n"))}
                                  style={{width: 650, height: 300, resize: "none"}} as="textarea"/>
                </Form>
                <Button className="w-25" onClick={onCLickCheckHandler}>{isLoading ? <Spinner animation="grow" size="sm"/> : "Check"}</Button>
            </div>
            <div className="mt-3">
                <Creator/>
            </div>
            {results.length !== 0 && (
                <div>
                    <h5 className="mt-3">Results</h5>
                    <h5 className="mb-3">{`Total: ${total} $STRKR`}</h5>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Wallet</th>
                            <th>Amount</th>
                            <th>Eligible</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result, index) => <Result key={index} result={result} index={index}/>)}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default App;
