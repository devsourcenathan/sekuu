import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/lib/constants/routes';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '../ui/select';
import { supportedLanguages } from '@/lib/i18n';
import { useAuthStore } from '@/store/authStore';
import authApi from '@/features/auth/api/authApi';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, clearAuth } = useAuthStore();

    const getDashboardRoute = () => {
        if (!user) return ROUTES.DASHBOARD;
        return ROUTES.DASHBOARD;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center">
            <div className="container flex h-16 items-center">
                <div className="mr-4 flex">
                    <Link to={ROUTES.HOME} className="mr-6 flex items-center space-x-2">
                        <BookOpen className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            Sekuu
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    <Link
                        to={ROUTES.COURSES}
                        className="transition-colors hover:text-foreground/80"
                    >
                        {t('header.courses')}
                    </Link>
                </nav>

                <div className="flex items-center space-x-2">
                    {/* Language selector */}
                    <Select
                        onValueChange={(v) => {
                            i18n.changeLanguage(v);
                            try {
                                localStorage.setItem('i18nextLng', v);
                            } catch { }
                        }}>
                        <SelectTrigger className="cursor-pointer w-16">
                            {i18n.language.toUpperCase()}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {supportedLanguages.map((lang) => {
                                    return <SelectItem key={lang} value={lang} className="cursor-pointer">{lang.toUpperCase()}</SelectItem>
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Theme toggle */}
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="default" className="relative bg-gray-300 h-10 w-10 rounded-full cursor-pointer">
                                    <Avatar>
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className='cursor-pointer'>
                                    <Link to={getDashboardRoute()}>{t('header.dashboard')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className='cursor-pointer'>
                                    <Link to={ROUTES.DASHBOARD}>{t('header.myCourses')}</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                    clearAuth();
                                    authApi.logout();
                                }} className='cursor-pointer'>
                                    {t('header.logout')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link to={ROUTES.LOGIN}>
                                <Button variant="ghost">{t('header.login')}</Button>
                            </Link>
                            <Link to={ROUTES.REGISTER}>
                                <Button>{t('header.register')}</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}