'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { useAuthStore } from '../../../stores/auth.store';
import { cn } from '../../../lib/utils';
import PasswordStrengthBar from '../../../components/auth/PasswordStrengthBar';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['shipper', 'carrier']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('auth.register');
  const { register: registerUser, isLoading } = useAuthStore();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'shipper' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      setEmailSent(true);
      toast.success(t('successDescription'));
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: unknown) {
      const error = err as { message?: string | string[] };
      const message = Array.isArray(error?.message)
        ? error.message[0]
        : error?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  if (emailSent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('successTitle')}</CardTitle>
          <CardDescription>{t('successDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('redirecting')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input
                id="firstName"
                placeholder="John"
                autoComplete="given-name"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                autoComplete="family-name"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password')}
            />
            <PasswordStrengthBar password={watch('password') ?? ''} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('roleLabel')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['shipper', 'carrier'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('role', role)}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-sm font-medium capitalize transition-colors',
                    selectedRole === role
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50',
                  )}
                >
                  {t(`roles.${role}`)}
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('submitting') : t('submit')}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {t('signinPrompt')}{' '}
            <Link href="/login" className="text-primary underline underline-offset-4">
              {t('signin')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
