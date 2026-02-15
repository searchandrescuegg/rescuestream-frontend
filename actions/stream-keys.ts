'use server';

import { revalidatePath } from 'next/cache';
import { getRescueStreamClient } from '@/lib/api/client';
import { auth } from '@/lib/auth';
import type {
  StreamKey,
  CreateStreamKeyRequest,
  APIError,
} from '@/types';

async function getSessionUser() {
  const session = await auth();
  return session?.user
    ? { email: session.user.email, name: session.user.name }
    : null;
}

export async function createStreamKey(
  data: CreateStreamKeyRequest
): Promise<{ success: true; streamKey: StreamKey } | { success: false; error: string }> {
  const user = await getSessionUser();
  const client = getRescueStreamClient();

  try {
    const streamKey = await client.createStreamKey(data);

    // Audit log the successful creation
    try {
      await client.createAuditLog({
        event_type: 'stream_key_created',
        actor: user?.email || 'unknown',
        resource_type: 'stream_key',
        resource_id: streamKey.id,
        request_method: 'POST',
        request_path: '/stream-keys',
        outcome: 'success',
        metadata: {
          user_name: user?.name,
          broadcaster_id: data.broadcaster_id,
          expires_at: data.expires_at,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for stream key creation:', auditError);
    }

    revalidatePath('/stream-keys');
    return { success: true, streamKey };
  } catch (error) {
    const apiError = error as APIError;

    // Audit log the failed creation
    try {
      await client.createAuditLog({
        event_type: 'stream_key_created',
        actor: user?.email || 'unknown',
        resource_type: 'stream_key',
        request_method: 'POST',
        request_path: '/stream-keys',
        outcome: 'failure',
        failure_reason: apiError.detail || 'Failed to create stream key',
        metadata: {
          user_name: user?.name,
          broadcaster_id: data.broadcaster_id,
          expires_at: data.expires_at,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for stream key creation failure:', auditError);
    }

    return { success: false, error: apiError.detail || 'Failed to create stream key' };
  }
}

export async function revokeStreamKey(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await getSessionUser();
  const client = getRescueStreamClient();

  try {
    await client.revokeStreamKey(id);

    // Audit log the successful revocation
    try {
      await client.createAuditLog({
        event_type: 'stream_key_revoked',
        actor: user?.email || 'unknown',
        resource_type: 'stream_key',
        resource_id: id,
        request_method: 'DELETE',
        request_path: `/stream-keys/${id}`,
        outcome: 'success',
        metadata: {
          user_name: user?.name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for stream key revocation:', auditError);
    }

    revalidatePath('/stream-keys');
    return { success: true };
  } catch (error) {
    const apiError = error as APIError;

    // Audit log the failed revocation
    try {
      await client.createAuditLog({
        event_type: 'stream_key_revoked',
        actor: user?.email || 'unknown',
        resource_type: 'stream_key',
        resource_id: id,
        request_method: 'DELETE',
        request_path: `/stream-keys/${id}`,
        outcome: 'failure',
        failure_reason: apiError.detail || 'Failed to revoke stream key',
        metadata: {
          user_name: user?.name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for stream key revocation failure:', auditError);
    }

    return { success: false, error: apiError.detail || 'Failed to revoke stream key' };
  }
}
