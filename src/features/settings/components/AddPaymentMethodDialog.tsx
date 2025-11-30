import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodsApi } from '../api/paymentMethodsApi';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import type { PaymentGateway, MobileMoneyProvider } from '../types/settings.types';

interface AddPaymentMethodDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const mobileMoneyProviders: { id: MobileMoneyProvider; name: string; logo: string }[] = [
    { id: 'mtn', name: 'MTN Mobile Money', logo: '📱' },
    { id: 'orange', name: 'Orange Money', logo: '🟠' },
    { id: 'airtel', name: 'Airtel Money', logo: '🔴' },
    { id: 'wave', name: 'Wave', logo: '🌊' },
];

export function AddPaymentMethodDialog({ isOpen, onClose }: AddPaymentMethodDialogProps) {
    const queryClient = useQueryClient();
    const [gateway] = useState<PaymentGateway>('flutterwave');
    const [provider, setProvider] = useState<MobileMoneyProvider>('mtn');
    const [phoneNumber, setPhoneNumber] = useState('');

    const addMutation = useMutation({
        mutationFn: paymentMethodsApi.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
            toast.success('Moyen de paiement ajouté avec succès');
            onClose();
            setPhoneNumber('');
        },
        onError: () => {
            toast.error('Erreur lors de l\'ajout du moyen de paiement');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!phoneNumber) {
            toast.error('Veuillez entrer un numéro de téléphone');
            return;
        }

        addMutation.mutate({
            gateway,
            type: 'mobile_money',
            data: {
                provider,
                phone_number: phoneNumber,
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Ajouter Mobile Money</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Opérateur</label>
                        <div className="grid grid-cols-2 gap-2">
                            {mobileMoneyProviders.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setProvider(p.id)}
                                    className={`p-3 border-2 rounded-lg transition-all ${provider === p.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{p.logo}</div>
                                    <div className="text-sm font-medium">{p.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+237 6XX XXX XXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Format international avec indicatif pays
                        </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={addMutation.isPending}
                            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {addMutation.isPending ? 'Ajout...' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
