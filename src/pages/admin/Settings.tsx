import { useTranslation } from 'react-i18next';

export function AdminSettings() {
    const { t } = useTranslation();
    return (
        <div>
            <h1 className="text-3xl font-bold">{t('pagesTitles.adminSettings')}</h1>
            <p className="mt-2 text-muted-foreground">{t('pages.comingSoon.phase8')}</p>
        </div>
    );
}
