'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { IconBrandGoogle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/streams' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="RescueStream"
              width={200}
              height={112}
              className="h-16 w-auto dark:hidden"
              priority
            />
            <Image
              src="/logo-dark.png"
              alt="RescueStream"
              width={200}
              height={112}
              className="hidden h-16 w-auto dark:block"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold">RescueStream</CardTitle>
          <CardDescription>
            Sign in to access the livestream dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <IconBrandGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
