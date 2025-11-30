// Currency types
export interface Currency {
    code: string;
    symbol: string;
    name: string;
    region: 'Africa' | 'International';
}

export const SUPPORTED_CURRENCIES: readonly Currency[] = [
    // African currencies (priority)
    { code: 'XAF', symbol: 'FCFA', name: 'CFA Franc BEAC (Afrique Centrale)', region: 'Africa' },
    { code: 'XOF', symbol: 'FCFA', name: 'CFA Franc BCEAO (Afrique de l\'Ouest)', region: 'Africa' },
    { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain', region: 'Africa' },
    { code: 'TND', symbol: 'DT', name: 'Dinar Tunisien', region: 'Africa' },
    { code: 'DZD', symbol: 'DA', name: 'Dinar Algérien', region: 'Africa' },
    { code: 'EGP', symbol: 'E£', name: 'Livre Égyptienne', region: 'Africa' },
    { code: 'NGN', symbol: '₦', name: 'Naira Nigérian', region: 'Africa' },
    { code: 'GHS', symbol: 'GH₵', name: 'Cedi Ghanéen', region: 'Africa' },
    { code: 'KES', symbol: 'KSh', name: 'Shilling Kenyan', region: 'Africa' },
    { code: 'ZAR', symbol: 'R', name: 'Rand Sud-Africain', region: 'Africa' },

    // International currencies
    { code: 'USD', symbol: '$', name: 'Dollar Américain', region: 'International' },
    { code: 'EUR', symbol: '€', name: 'Euro', region: 'International' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling', region: 'International' },
    { code: 'CAD', symbol: 'C$', name: 'Dollar Canadien', region: 'International' },
] as const;

export interface ExchangeRates {
    base_currency: string;
    rates: Record<string, number>;
    updated_at: string;
}

export interface ConversionResult {
    original_amount: number;
    original_currency: string;
    converted_amount: number;
    target_currency: string;
    rate: number;
}

// Payment Method types
export type PaymentGateway = 'stripe' | 'paypal' | 'flutterwave';
export type PaymentMethodType = 'card' | 'mobile_money' | 'bank_account';
export type MobileMoneyProvider = 'mtn' | 'orange' | 'airtel' | 'wave' | 'mpesa';

export interface PaymentMethod {
    id: number;
    user_id: number;
    gateway: PaymentGateway;
    gateway_payment_method_id: string;
    type: PaymentMethodType;
    is_default: boolean;
    metadata: Record<string, any>;
    last_four?: string;
    brand?: string;
    expires_at?: string;
    created_at: string;
    updated_at: string;
    display_name?: string;
}

export interface AddPaymentMethodData {
    gateway: PaymentGateway;
    type: PaymentMethodType;
    data: Record<string, any>;
}

// Legal Page types
export interface LegalPage {
    id: number;
    slug: string;
    title: string;
    content: string;
    version: string;
    is_published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export interface LegalPageFormData {
    title: string;
    content: string;
    version: string;
    is_published: boolean;
}

// User Settings types
export interface UserProfileData {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: File;
}

export interface PasswordUpdateData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

// Instructor Payout types
export type PayoutMethod = 'bank_transfer' | 'mobile_money' | 'paypal';
export type PayoutSchedule = 'weekly' | 'monthly';

export interface InstructorEarnings {
    pending_earnings: number;
    total_earnings: number;
    can_request_payout: boolean;
    payout_threshold: number;
    payout_method?: PayoutMethod;
    payout_currency?: string;
}

export interface PayoutSettings {
    method: PayoutMethod;
    currency: string;
    schedule: PayoutSchedule;
    threshold: number;
    details: BankDetails | MobileMoneyDetails | PayPalDetails;
}

export interface BankDetails {
    account_number: string;
    bank_name: string;
    swift_code?: string;
}

export interface MobileMoneyDetails {
    provider: MobileMoneyProvider;
    phone_number: string;
}

export interface PayPalDetails {
    email: string;
}
