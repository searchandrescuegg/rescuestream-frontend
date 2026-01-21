import { IconBroadcast, IconLock } from '@tabler/icons-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive">
            <IconLock className="h-6 w-6 text-destructive-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>
            Your account is not authorized to access RescueStream
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              Access to this dashboard is restricted to authorized personnel
              only.
            </p>
            <p>
              If you believe you should have access, please contact your
              administrator to request authorization.
            </p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              <IconBroadcast className="mr-2 h-4 w-4" />
              Return to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
