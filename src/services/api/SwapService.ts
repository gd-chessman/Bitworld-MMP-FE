import axiosClient from "@/utils/axiosClient";

// Types for swap API
export interface CreateSwapRequest {
    swap_type: "usdt_to_sol" | "sol_to_usdt";
    input_amount: number;
}

export interface SwapOrder {
    swap_order_id: number;
    wallet_id?: number;
    swap_type: "usdt_to_sol" | "sol_to_usdt";
    input_amount: string;
    output_amount: string;
    exchange_rate: string;
    swap_fee_percent?: number;
    fee_amount: string;
    status: string;
    transaction_hash: string;
    error_message: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSwapResponse {
    success: boolean;
    message: string;
    data: SwapOrder;
}

export interface GetSwapHistoryResponse {
    success: boolean;
    message: string;
    data: SwapOrder[];
}

export const createSwap = async (swapData: CreateSwapRequest): Promise<CreateSwapResponse> => {
    const response = await axiosClient.post('/swaps', swapData);
    return response.data;
}

export const getSwapHistory = async (): Promise<GetSwapHistoryResponse> => {
    const response = await axiosClient.get('/swaps');
    return response.data;
}
