import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export function NotFound() {
    const { t } = useTranslation();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="mt-4 text-2xl font-semibold">{t('errors.notFound.title')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('errors.notFound.message')}
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <Link to={ROUTES.HOME}>
                        <Button>
                            <Home className="mr-2 h-4 w-4" />
                            {t('errors.notFound.backHome')}
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('errors.notFound.backHome')}
                    </Button>
                </div>
            </div>
        </div>
    );
}