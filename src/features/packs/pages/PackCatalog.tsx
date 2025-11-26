import { useState } from 'react';
import { usePacks, useEnrollInPack } from '../hooks/usePacks';
import { PackCard } from '@/components/pack/PackCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function PackCatalog() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: packsData, isLoading } = usePacks({ search: searchQuery });
    const enrollInPack = useEnrollInPack();

    const handleEnroll = async (packId: number) => {
        await enrollInPack.mutateAsync(packId);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const packs = packsData?.data || [];

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold">Course Packs</h1>
                <p className="text-muted-foreground">
                    Discover our curated course bundles and save money
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search packs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                    <PackCard
                        key={pack.id}
                        pack={pack}
                        onEnroll={handleEnroll}
                        showEnrollButton={true}
                    />
                ))}
            </div>

            {packs.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        No packs found. Try adjusting your search.
                    </p>
                </div>
            )}
        </div>
    );
}
