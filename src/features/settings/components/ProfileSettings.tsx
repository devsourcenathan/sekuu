import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { userSettingsApi } from '../api/userSettingsApi';
import { toast } from 'sonner';

export function ProfileSettings() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const updateMutation = useMutation({
        mutationFn: userSettingsApi.updateProfile,
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            toast.success('Profil mis à jour avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour du profil');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            ...formData,
            avatar: avatarFile || undefined,
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Informations du Profil</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Mettez à jour vos informations personnelles.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Photo de profil</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full"
                    />
                    {avatarFile && (
                        <p className="text-sm text-gray-500 mt-1">
                            Fichier sélectionné: {avatarFile.name}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Téléphone</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        maxLength={500}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.bio.length}/500 caractères
                    </p>
                </div>
            </div>

            <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
        </form>
    );
}
