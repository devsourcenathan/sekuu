import { useState } from 'react';
import { User, CreditCard, Lock, Bell, Shield, DollarSign, Building } from 'lucide-react';
import { ProfileSettings } from '@/features/settings/components/ProfileSettings';
import { CurrencySettings } from '@/features/settings/components/CurrencySettings';
import { PaymentMethodsSettings } from '@/features/settings/components/PaymentMethodsSettings';
import { PasswordSettings } from '@/features/settings/components/PasswordSettings';
import { InstructorPayoutSettings } from '@/features/settings/components/InstructorPayoutSettings';
import { useAuthStore } from '@/store/authStore';

export default function Settings() {
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState('profile');


    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'security', label: 'Sécurité', icon: Lock },
        { id: 'currency', label: 'Devise', icon: DollarSign },
        { id: 'payment', label: 'Moyens de paiement', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    // Add instructor tab if user is instructor or admin
    const hasRole = (role: string) => user?.roles?.some(r => r.slug === role);
    if (hasRole('instructor') || hasRole('admin')) {
        tabs.push({ id: 'payouts', label: 'Versements', icon: Building });
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'security':
                return <PasswordSettings />;
            case 'currency':
                return <CurrencySettings />;
            case 'payment':
                return <PaymentMethodsSettings />;
            case 'payouts':
                return <InstructorPayoutSettings />;
            case 'notifications':
                return <div className="p-4 text-gray-500">Paramètres de notification (bientôt disponible)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Paramètres</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
