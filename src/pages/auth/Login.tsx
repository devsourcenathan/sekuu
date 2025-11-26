import LoginForm from "../../components/auth/LoginForm";
import { useTranslation } from 'react-i18next';

export function Login() {
    const { t } = useTranslation();
    return (
        <div className="p-6 flex justify-center items-start">
            <div className="w-full max-w-lg">
                <h1 className="text-2xl font-semibold mb-4">{t('auth.login.title')}</h1>
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;