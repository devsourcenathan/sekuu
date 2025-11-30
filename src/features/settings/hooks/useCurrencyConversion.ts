import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { currencyApi } from '../api/currencyApi';
import { SUPPORTED_CURRENCIES } from '../types/settings.types';

export function useCurrencyConversion() {
    const { user } = useAuth();
    const preferredCurrency = user?.preferred_currency || 'USD';

    // Load exchange rates
    const { data: ratesData } = useQuery({
        queryKey: ['exchange-rates', preferredCurrency],
        queryFn: () => currencyApi.getRates(preferredCurrency),
        staleTime: 3600000, // 1 hour
        gcTime: 3600000,
    });

    const rates = ratesData?.rates || {};

    const convert = (amount: number, fromCurrency: string): number => {
        if (fromCurrency === preferredCurrency) return amount;

        const rate = rates[preferredCurrency] || 1;
        return Math.round(amount * rate * 100) / 100;
    };

    const formatPrice = (amount: number, currency: string): string => {
        const convertedAmount = convert(amount, currency);
        const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === preferredCurrency);

        const symbol = currencyInfo?.symbol || preferredCurrency;
        const formattedAmount = convertedAmount.toFixed(2);

        // For FCFA, put symbol after amount
        if (preferredCurrency === 'XAF' || preferredCurrency === 'XOF') {
            return `${formattedAmount} ${symbol}`;
        }

        return `${symbol}${formattedAmount}`;
    };

    return {
        convert,
        formatPrice,
        preferredCurrency,
        rates,
    };
}
