import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Pack } from '@/types';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PackCardProps {
    pack: Pack;
    onEnroll?: (packId: number) => void;
    showEnrollButton?: boolean;
}

export function PackCard({ pack, onEnroll, showEnrollButton = true }: PackCardProps) {
    const { t } = useTranslation();

    const handleEnroll = () => {
        if (onEnroll) {
            onEnroll(pack.id);
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                {pack.cover_image ? (
                    <img
                        src={pack.cover_image}
                        alt={pack.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/20" />
                    </div>
                )}

                {/* Discount Badge */}
                {pack.discount_percentage > 0 && (
                    <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                        -{pack.discount_percentage.toFixed(0)}%
                    </Badge>
                )}

                {/* Pack Badge */}
                <Badge className="absolute top-3 left-3 bg-primary">
                    Pack
                </Badge>
            </div>

            <CardHeader>
                <Link to={`/packs/${pack.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                        {pack.title}
                    </h3>
                </Link>
                {pack.instructor && (
                    <p className="text-sm text-muted-foreground">
                        {t('pack.by')} {pack.instructor.name}
                    </p>
                )}
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {pack.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>{pack.total_courses} {t('pack.courses')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{pack.students_enrolled} {t('pack.students')}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(pack.total_duration_minutes / 60)}h</span>
                    </div>
                    {pack.discount_percentage > 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>{t('pack.save')} {pack.discount_percentage.toFixed(0)}%</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-4 border-t">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">
                        {pack.price} {pack.currency}
                    </span>
                    {pack.discount_percentage > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {t('pack.instead_of')} {(pack.price / (1 - pack.discount_percentage / 100)).toFixed(2)} {pack.currency}
                        </span>
                    )}
                </div>

                {showEnrollButton && (
                    <Button onClick={handleEnroll}>
                        {t('pack.enroll')}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
