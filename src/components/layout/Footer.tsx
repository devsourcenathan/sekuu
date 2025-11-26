import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t bg-background flex justify-center">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-6 w-6" />
                            <span className="font-bold">Sekuu</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('footer.platform')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to={ROUTES.COURSES} className="hover:underline">
                                    {t('footer.catalog')}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:underline">
                                    {t('footer.becomeInstructor')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('footer.support')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="#" className="hover:underline">
                                    {t('footer.helpCenter')}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:underline">
                                    {t('footer.contact')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('footer.legal')}</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="#" className="hover:underline">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="hover:underline">
                                    {t('footer.privacy')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Sekuu. {t('footer.rights')}
                </div>
            </div>
        </footer>
    );
}