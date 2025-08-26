import axiosClient from "@/utils/axiosClient";

export const getTradeAmount = async (code: any)=>{
    try {
        const temp = await axiosClient.get(`/trade/amount/${code}`)
        return {
            "token_address": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
            "token_balance": 0.003559,
            "token_balance_usd": 0.029494305393661074,
            "sol_balance": 1,
            "sol_balance_usd": 100
        };
    } catch (error) {
        console.log(error)
        return {};
    }
}


export const getOrders = async (address: any)=>{
    try {
        const temp = await axiosClient.get(`/trade/orders?token=${address}`,)
        return temp.data.data.orders;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getOrderBook = async ()=>{
    try {
        const temp = await axiosClient.get("/trade/order-book")
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const getTokenAmount = async (item: any)=>{
    try {
        const temp = await axiosClient.get(`/trade/amount/${item}`)
        return temp.data;
    } catch (error) {
        console.log(error)
        return {};
    }
}

export const createTrading = async (item: any)=>{
    try {
        const temp = await axiosClient.post("/trade/orders", item)
        return temp.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}