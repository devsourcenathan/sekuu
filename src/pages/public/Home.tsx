import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';

export function Home() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center">
            {/* Hero Section */}
            <section className="container py-20 md:py-32 align-center flex flex-col items-center justify-center">
                <div className="mx-auto  text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        {t('home.hero.title')}
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground">
                        {t('home.hero.desc')}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                        <Link to={ROUTES.COURSES}>
                            <Button size="lg">
                                {t('home.hero.explore')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to={ROUTES.REGISTER}>
                            <Button size="lg" variant="outline">
                                {t('home.hero.startFree')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/50 py-20   w-full  align-center flex flex-col items-center justify-center">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold">{t('home.features.title')}</h2>
                        <p className="mt-4 text-muted-foreground">{t('home.features.desc')}</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <BookOpen className="h-10 w-10 text-primary" />
                                <CardTitle>{t('home.features.quality')}</CardTitle>
                                <CardDescription>
                                    {t('home.features.quality')}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="h-10 w-10 text-primary" />
                                <CardTitle>{t('home.features.community')}</CardTitle>
                                <CardDescription>
                                    {t('home.features.community')}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Award className="h-10 w-10 text-primary" />
                                <CardTitle>{t('home.features.certificates')}</CardTitle>
                                <CardDescription>
                                    {t('home.features.certificates')}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}