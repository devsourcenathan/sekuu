import RegisterForm from "../../components/auth/RegisterForm";
import { useTranslation } from 'react-i18next';

export function Register() {
    const { t } = useTranslation();
    return (
        <div className="p-6 flex justify-center items-start">
            <div className="w-full max-w-lg">
                <h1 className="text-2xl font-semibold mb-4">{t('auth.register.title')}</h1>
                <RegisterForm />
            </div>
        </div>
    );
}

export default Register;