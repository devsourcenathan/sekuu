import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../features/auth/hooks/useLogin";
import { useTranslation } from 'react-i18next';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FormValues = {
    email: string;
    password: string;
};

export const LoginForm: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState } = useForm<FormValues>();
    const { errors } = formState;
    const { login, loading } = useLogin();
    const navigate = useNavigate();

    const onSubmit = async (values: FormValues) => {
        const res = await login(values);
        if (res.success) {
            navigate("/");
        } else {
            // simple alert for now; could wire sonner or other toast
            alert(res.message || t('errors.loginFailed'));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
            <div>
                <label className="block text-sm font-medium">{t('auth.email')}</label>
                <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    {...register("email", { required: true })}
                    type="email"
                    autoComplete="email"
                />
                {errors.email && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <label className="block text-sm font-medium">{t('auth.password')}</label>
                <Input
                    className="mt-1 w-full border rounded px-3 py-2"
                    {...register("password", { required: true })}
                    type="password"
                    autoComplete="current-password"
                />
                {errors.password && <div className="text-sm text-red-600">{t('auth.required')}</div>}
            </div>

            <div>
                <Button
                    type="submit"
                    disabled={loading}
                    variant={"outline"}
                    className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
                >
                    {loading ? t('auth.login.loading') : t('auth.login.submit')}
                </Button>
            </div>

            <div>
                <Link className="text-primary hover:underline cursor-pointer " to="/register">{t('auth.login.register')}</Link>
            </div>
        </form>
    );
};

export default LoginForm;
