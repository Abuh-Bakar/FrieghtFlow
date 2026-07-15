'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
import { forgotPassword } from '../../../lib/api/auth.api';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch {
      // Always show the success state to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('successTitle')}</CardTitle>
          <CardDescription>{t('successDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('resendPrompt')}{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary underline underline-offset-4"
            >
              {t('tryAgain')}
            </button>
            .
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="text-sm text-primary underline underline-offset-4">
            {t('backToSignin')}
          </Link>
        </CardFooter>
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('submitting') : t('submit')}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {t('remembered')}{' '}
            <Link href="/login" className="text-primary underline underline-offset-4">
              {t('signin')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
