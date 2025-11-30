import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { currencyApi } from '../api/currencyApi';
import { SUPPORTED_CURRENCIES } from '../types/settings.types';
import { toast } from 'sonner';

export function CurrencySettings() {
    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [currency, setCurrency] = useState(user?.preferred_currency || 'USD');

    const updateMutation = useMutation({
        mutationFn: currencyApi.updatePreferredCurrency,
        onSuccess: () => {
            if (user) {
                updateUser({ preferred_currency: currency });
            }
            queryClient.invalidateQueries({ queryKey: ['exchange-rates'] });
            toast.success('Devise mise à jour avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour de la devise');
        },
    });

    const handleUpdate = (newCurrency: string) => {
        setCurrency(newCurrency);
        updateMutation.mutate(newCurrency);
    };

    // Group currencies by region
    const africanCurrencies = SUPPORTED_CURRENCIES.filter((c) => c.region === 'Africa');
    const internationalCurrencies = SUPPORTED_CURRENCIES.filter((c) => c.region === 'International');

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Devise Préférée</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Choisissez la devise dans laquelle vous souhaitez voir les prix affichés.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Devises Africaines</label>
                    <select
                        value={currency}
                        onChange={(e) => handleUpdate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={updateMutation.isPending}
                    >
                        {africanCurrencies.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                                {curr.symbol} - {curr.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Devises Internationales</label>
                    <select
                        value={currency}
                        onChange={(e) => handleUpdate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={updateMutation.isPending}
                    >
                        {internationalCurrencies.map((curr) => (
                            <option key={curr.code} value={curr.code}>
                                {curr.symbol} - {curr.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {updateMutation.isPending && (
                <p className="text-sm text-gray-500">Mise à jour en cours...</p>
            )}
        </div>
    );
}
