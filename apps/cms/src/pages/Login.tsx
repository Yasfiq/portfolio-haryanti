import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToastHelpers } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const toast = useToastHelpers();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setError(null);

        try {
            const { error } = await signIn(data.email, data.password);

            if (error) {
                setError(error.message);
                toast.error('Login Gagal', error.message);
            } else {
                toast.success('Login Berhasil', 'Selamat datang kembali!');
                navigate('/');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(message);
            toast.error('Login Gagal', message);
        }
    };

    return (
        <div className="min-h-screen bg-cms-bg-primary flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cms-accent mb-4">
                        <span className="text-3xl font-bold text-black">H</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-cms-text-primary">
                        Welcome Back
                    </h1>
                    <p className="text-cms-text-secondary mt-2">
                        Login ke CMS Portfolio Haryanti
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-cms-bg-card border border-cms-border rounded-xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-cms-error/10 border border-cms-error/30 rounded-lg text-cms-error text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isSubmitting}
                        >
                            Login
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-cms-text-muted text-sm mt-6">
                    Portfolio CMS • Haryanti
                </p>
            </div>
        </div>
    );
}
