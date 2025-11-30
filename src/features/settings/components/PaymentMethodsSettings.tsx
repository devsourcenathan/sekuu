import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodsApi } from '../api/paymentMethodsApi';
import { toast } from 'sonner';
import { CreditCard, Smartphone, Trash2, Check } from 'lucide-react';
import type { PaymentMethod } from '../types/settings.types';
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog';

export function PaymentMethodsSettings() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: paymentMethods = [], isLoading } = useQuery({
        queryKey: ['payment-methods'],
        queryFn: paymentMethodsApi.list,
    });

    const deleteMutation = useMutation({
        mutationFn: paymentMethodsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
            toast.success('Moyen de paiement supprimé');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        },
    });

    const setDefaultMutation = useMutation({
        mutationFn: paymentMethodsApi.setDefault,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
            toast.success('Moyen de paiement par défaut mis à jour');
        },
    });

    const getIcon = (method: PaymentMethod) => {
        if (method.type === 'mobile_money') {
            return <Smartphone className="w-5 h-5" />;
        }
        return <CreditCard className="w-5 h-5" />;
    };

    const getDisplayName = (method: PaymentMethod) => {
        if (method.type === 'mobile_money') {
            const provider = method.metadata?.provider || 'Mobile Money';
            const phone = method.metadata?.phone_number || '';
            return `${provider.toUpperCase()} - ${phone.slice(-4)}`;
        }
        if (method.type === 'card') {
            return `${method.brand || 'Card'} •••• ${method.last_four}`;
        }
        return method.type;
    };

    if (isLoading) {
        return <div>Chargement...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Moyens de Paiement</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Gérez vos cartes bancaires et comptes Mobile Money.
                    </p>
                </div>

                <div className="space-y-3">
                    {paymentMethods.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Aucun moyen de paiement enregistré
                        </div>
                    ) : (
                        paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {getIcon(method)}
                                    <div>
                                        <p className="font-medium">{getDisplayName(method)}</p>
                                        {method.expires_at && (
                                            <p className="text-sm text-gray-500">
                                                Expire: {new Date(method.expires_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    {method.is_default && (
                                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Par défaut
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!method.is_default && (
                                        <button
                                            onClick={() => setDefaultMutation.mutate(method.id)}
                                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            disabled={setDefaultMutation.isPending}
                                        >
                                            Définir par défaut
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMutation.mutate(method.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        disabled={deleteMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ajouter un moyen de paiement
                </button>
            </div>

            <AddPaymentMethodDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}
