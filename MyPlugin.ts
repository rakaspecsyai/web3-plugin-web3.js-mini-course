import { Web3PluginBase, Contract, ContractAbi} from "web3";


class MyPlugin extends Web3PluginBase {

    public pluginNamespace = "myPlugin";

    // make call to a contract method
    public async callContractMethod(
        contractAddress: string,
        abi: ContractAbi,
        methodName: string,
        methodParams: any[] = []
    ): Promise<any> {
        const contract = new Contract(abi, contractAddress);
        return await contract.methods[methodName](...methodParams).call();
    }



    // subscribe to an event stream (returns the subscription / event emitter)
    // usage: const sub = plugin.subscribeToEvent(...); sub.on('data', handler).on('error', errHandler);
    public subscribeToEvent(
        contractAddress: string,
        abi: ContractAbi,
        eventName: string,
        options: any = {}
    ): any {
        const contract = new Contract(abi, contractAddress);
        if (eventName && (contract.events as any)[eventName]) {
            return (contract.events as any)[eventName](options);
        }
        return contract.events.allEvents(options);
    }

    // estimate gas for a method with an optional multiplier buffer (returns integer gas)
    public async estimateGasForMethod(
        contractAddress: string,
        abi: ContractAbi,
        methodName: string,
        methodParams: any[] = [],
        fromAddress?: string,
        value: string = "0",
        gasMultiplier: number = 1.2
    ): Promise<number> {
        const contract = new Contract(abi, contractAddress);
        const estimate = await contract.methods[methodName](...methodParams).estimateGas({ from: fromAddress, value });
        return Math.ceil(Number(estimate) * gasMultiplier);
    }


}