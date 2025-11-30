import { useCurrencyConversion } from '@/features/settings/hooks/useCurrencyConversion';

interface PriceProps {
    amount: number;
    currency: string;
    className?: string;
}

export function Price({ amount, currency, className = '' }: PriceProps) {
    const { formatPrice } = useCurrencyConversion();

    return (
        <span className={`font-semibold ${className}`}>
            {formatPrice(amount, currency)}
        </span>
    );
}
