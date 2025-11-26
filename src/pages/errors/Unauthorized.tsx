import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export function Unauthorized() {
    const { t } = useTranslation();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-red-100 p-6">
                        <ShieldAlert className="h-16 w-16 text-red-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold">{t('errors.unauthorized.title')}</h1>
                <p className="mt-2 text-muted-foreground">
                    {t('errors.unauthorized.message')}
                </p>
                <div className="mt-8">
                    <Link to={ROUTES.HOME}>
                        <Button>
                            <Home className="mr-2 h-4 w-4" />
                            {t('errors.unauthorized.backHome')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}