import { apiGet, apiPut } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ExchangeRates, ConversionResult } from '../types/settings.types';

export const currencyApi = {
    /**
     * Get all exchange rates for a base currency
     */
    getRates: async (baseCurrency: string): Promise<ExchangeRates> => {
        return apiGet<ExchangeRates>(ENDPOINTS.CURRENCY.RATES(baseCurrency));
    },

    /**
     * Convert an amount between currencies
     */
    convert: async (
        amount: number,
        from: string,
        to: string
    ): Promise<ConversionResult> => {
        return apiGet<ConversionResult>(ENDPOINTS.CURRENCY.CONVERT, { amount, from, to });
    },

    /**
     * Update user's preferred currency
     */
    updatePreferredCurrency: async (currency: string): Promise<void> => {
        return apiPut<void>(ENDPOINTS.CURRENCY.UPDATE_PREFERENCE, { currency });
    },
};
