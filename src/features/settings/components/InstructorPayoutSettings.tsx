import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorApi } from '../api/instructorApi';
import { toast } from 'sonner';
import { DollarSign, CreditCard, Building, Smartphone } from 'lucide-react';
import type { PayoutSettings, PayoutMethod, MobileMoneyProvider } from '../types/settings.types';
import { Price } from '@/components/Price';

export function InstructorPayoutSettings() {
    const queryClient = useQueryClient();
    const [method, setMethod] = useState<PayoutMethod>('mobile_money');

    // Load earnings summary
    const { data: earnings } = useQuery({
        queryKey: ['instructor-earnings'],
        queryFn: instructorApi.getEarnings,
    });


    // Load payout settings (mocked for now as we don't have a direct endpoint for just settings, 
    // usually it comes with user profile or separate endpoint. 
    // Assuming we might need to fetch it or it's part of the user object.
    // For this implementation, we'll manage state locally for the form)

    const updateSettingsMutation = useMutation({
        mutationFn: instructorApi.updatePayoutSettings,
        onSuccess: () => {
            toast.success('Paramètres de paiement mis à jour');
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour');
        },
    });

    const requestPayoutMutation = useMutation({
        mutationFn: instructorApi.requestPayout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-earnings'] });
            toast.success('Demande de paiement envoyée');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors de la demande');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Collect form data and call mutation
        // This is a simplified handler
        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = Object.fromEntries(formData.entries());

        const settings: PayoutSettings = {
            method,
            currency: 'XAF', // Default to XAF for now
            schedule: 'monthly',
            threshold: 50000,
            details: {} as any
        };

        if (method === 'mobile_money') {
            settings.details = {
                provider: data.provider as MobileMoneyProvider,
                phone_number: data.phone_number
            };
        } else if (method === 'bank_transfer') {
            settings.details = {
                bank_name: data.bank_name,
                account_number: data.account_number,
                swift_code: data.swift_code
            };
        } else if (method === 'paypal') {
            settings.details = {
                email: data.paypal_email
            };
        }

        updateSettingsMutation.mutate(settings);
    };

    return (
        <div className="space-y-8">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-600">Revenus Totaux</h4>
                    </div>
                    <p className="text-2xl font-bold">
                        <Price amount={earnings?.total_earnings || 0} currency="XAF" />
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-600">En attente</h4>
                    </div>
                    <p className="text-2xl font-bold">
                        <Price amount={earnings?.pending_earnings || 0} currency="XAF" />
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Building className="w-5 h-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-600">Seuil de paiement</h4>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold">
                            <Price amount={earnings?.payout_threshold || 50000} currency="XAF" />
                        </p>
                        <button
                            onClick={() => requestPayoutMutation.mutate()}
                            disabled={!earnings?.can_request_payout || requestPayoutMutation.isPending}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Demander
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-6">Paramètres de Versement</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Méthode de paiement</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setMethod('mobile_money')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${method === 'mobile_money'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Smartphone className="w-6 h-6" />
                                <span className="font-medium">Mobile Money</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod('bank_transfer')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${method === 'bank_transfer'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Building className="w-6 h-6" />
                                <span className="font-medium">Virement Bancaire</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod('paypal')}
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${method === 'paypal'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span className="font-medium">PayPal</span>
                            </button>
                        </div>
                    </div>

                    {method === 'mobile_money' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Opérateur</label>
                                <select
                                    name="provider"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="mtn">MTN Mobile Money</option>
                                    <option value="orange">Orange Money</option>
                                    <option value="airtel">Airtel Money</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    placeholder="+237..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {method === 'bank_transfer' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nom de la banque</label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Numéro de compte (IBAN)</label>
                                    <input
                                        type="text"
                                        name="account_number"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Code SWIFT/BIC</label>
                                    <input
                                        type="text"
                                        name="swift_code"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {method === 'paypal' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Adresse Email PayPal</label>
                            <input
                                type="email"
                                name="paypal_email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateSettingsMutation.isPending}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {updateSettingsMutation.isPending ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
