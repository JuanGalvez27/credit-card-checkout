import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WompiTokenizeCardRequest {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
}

export interface WompiTokenizeCardResponse {
    status: {
        status: string;
    };
    data: {
        id: string;
        created_at: string;
        brand: string;
        name: string;
        last_four: string;
        bin: string;
        exp_year: string;
        exp_month: string;
        card_holder: string;
        expires_at: string;
    };
}

export interface WompiAcceptanceTokenResponse {
    data: {
        presigned_acceptance: {
            acceptance_token: string;
            permalink: string;
            type: string;
        };
    };
}

export interface WompiPaymentSourceRequest {
    type: string;
    token: string;
    customer_email: string;
    acceptance_token: string;
}

export interface WompiPaymentSourceResponse {
    data: {
        id: number;
        type: string;
        token: string;
        customer_email: string;
        created_at: string;
    };
}

export interface WompiTransactionRequest {
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method: {
        installments: number;
    };
    reference: string;
    payment_source_id: number;
    signature: string;
}

export interface WompiTransactionResponse {
    data: {
        id: string;
        status: string;
        reference: string;
        amount_in_cents: number;
        currency: string;
        created_at: string;
    };
}

@Injectable()
export class WompiHttpClient {
    private readonly axiosInstance: ReturnType<typeof axios.create>;
    private readonly baseUrl: string;
    private readonly publicKey: string;
    private readonly privateKey: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = (this.configService.get<string>('UAT_SANDBOX_URL') || 'https://api-sandbox.co.uat.wompi.dev/v1').trim();
        this.publicKey = (this.configService.get<string>('API_KEY_PUB') || '').trim();
        this.privateKey = (this.configService.get<string>('API_KEY_PRIV') || '').trim();

        if (!this.publicKey) {
            throw new Error('API_KEY_PUB is not configured. Please check your .env file.');
        }
        if (!this.privateKey) {
            throw new Error('API_KEY_PRIV is not configured. Please check your .env file.');
        }

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
        });
    }

    async tokenizeCard(request: WompiTokenizeCardRequest): Promise<WompiTokenizeCardResponse> {
        try {
            const response = await this.axiosInstance.post<WompiTokenizeCardResponse>(
                '/tokens/cards',
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${this.publicKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Error tokenizing card:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response Status:', axiosError.response?.status);
                console.error('Response Data:', JSON.stringify(axiosError.response?.data));
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: {
                                type?: string;
                                reason?: string;
                            };
                        };
                        status?: number;
                    };
                    message?: string;
                };
                const errorMessage = axiosError.response?.data?.error?.reason
                    || axiosError.response?.data?.message
                    || axiosError.message
                    || 'Unknown error';
                throw new Error(`Wompi API error: ${errorMessage}`);
            }
            throw error;
        }
    }

    async getAcceptanceToken(): Promise<WompiAcceptanceTokenResponse> {
        try {
            const response = await this.axiosInstance.get<WompiAcceptanceTokenResponse>(
                `/merchants/${this.publicKey}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.publicKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data;
        } catch (error: unknown) {
            console.error('Error getting acceptance token:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response Status:', axiosError.response?.status);
                console.error('Response Data:', JSON.stringify(axiosError.response?.data));
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: {
                                type?: string;
                                reason?: string;
                            };
                        };
                        status?: number;
                    };
                    message?: string;
                };
                const errorMessage = axiosError.response?.data?.error?.reason
                    || axiosError.response?.data?.message
                    || axiosError.message
                    || 'Unknown error';
                throw new Error(`Wompi API error: ${errorMessage}`);
            }
            throw error;
        }
    }

    async createPaymentSource(request: WompiPaymentSourceRequest): Promise<WompiPaymentSourceResponse> {
        try {
            const response = await this.axiosInstance.post<WompiPaymentSourceResponse>(
                '/payment_sources',
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${this.privateKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error: unknown) {
            console.error('Error creating payment source:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response Status:', axiosError.response?.status);
                console.error('Response Data:', JSON.stringify(axiosError.response?.data));
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: {
                                type?: string;
                                reason?: string;
                            };
                        };
                        status?: number;
                    };
                    message?: string;
                };
                const errorMessage = axiosError.response?.data?.error?.reason
                    || axiosError.response?.data?.message
                    || axiosError.message
                    || 'Unknown error';
                throw new Error(`Wompi API error: ${errorMessage}`);
            }
            throw error;
        }
    }

    async createTransaction(request: WompiTransactionRequest): Promise<WompiTransactionResponse> {
        try {
            const response = await this.axiosInstance.post<WompiTransactionResponse>(
                '/transactions',
                request,
                {
                    headers: {
                        'Authorization': `Bearer ${this.privateKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data;
        } catch (error: unknown) {
            console.error('Error creating transaction:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Response Status:', axiosError.response?.status);
                console.error('Response Data:', JSON.stringify(axiosError.response?.data));
            }
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        data?: {
                            message?: string;
                            error?: {
                                type?: string;
                                reason?: string;
                            };
                        };
                        status?: number;
                    };
                    message?: string;
                };
                const errorMessage = axiosError.response?.data?.error?.reason
                    || axiosError.response?.data?.message
                    || axiosError.message
                    || 'Unknown error';
                throw new Error(`Wompi API error: ${errorMessage}`);
            }
            throw error;
        }
    }
}
