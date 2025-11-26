import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminPacks() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Packs Management</h1>
                    <p className="text-muted-foreground">
                        Manage all course packs on the platform
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Packs</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Pack management interface coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}
