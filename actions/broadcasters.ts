'use server';

import { revalidatePath } from 'next/cache';
import { getRescueStreamClient } from '@/lib/api/client';
import { auth } from '@/lib/auth';
import type {
  Broadcaster,
  CreateBroadcasterRequest,
  UpdateBroadcasterRequest,
  APIError,
} from '@/types';

async function getSessionUser() {
  const session = await auth();
  return session?.user
    ? { email: session.user.email, name: session.user.name }
    : null;
}

export async function createBroadcaster(
  data: CreateBroadcasterRequest
): Promise<{ success: true; broadcaster: Broadcaster } | { success: false; error: string }> {
  const user = await getSessionUser();
  const client = getRescueStreamClient();

  try {
    const broadcaster = await client.createBroadcaster(data);

    // Audit log the successful creation
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_created',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        resource_id: broadcaster.id,
        request_method: 'POST',
        request_path: '/broadcasters',
        outcome: 'success',
        metadata: {
          user_name: user?.name,
          broadcaster_name: broadcaster.display_name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster creation:', auditError);
    }

    revalidatePath('/broadcasters');
    return { success: true, broadcaster };
  } catch (error) {
    const apiError = error as APIError;

    // Audit log the failed creation
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_created',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        request_method: 'POST',
        request_path: '/broadcasters',
        outcome: 'failure',
        failure_reason: apiError.detail || 'Failed to create broadcaster',
        metadata: {
          user_name: user?.name,
          broadcaster_name: data.display_name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster creation failure:', auditError);
    }

    return { success: false, error: apiError.detail || 'Failed to create broadcaster' };
  }
}

export async function updateBroadcaster(
  id: string,
  data: UpdateBroadcasterRequest
): Promise<{ success: true; broadcaster: Broadcaster } | { success: false; error: string }> {
  const user = await getSessionUser();
  const client = getRescueStreamClient();

  try {
    const broadcaster = await client.updateBroadcaster(id, data);

    // Audit log the successful update
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_updated',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        resource_id: id,
        request_method: 'PATCH',
        request_path: `/broadcasters/${id}`,
        outcome: 'success',
        metadata: {
          user_name: user?.name,
          broadcaster_name: broadcaster.display_name,
          updated_fields: Object.keys(data),
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster update:', auditError);
    }

    revalidatePath('/broadcasters');
    return { success: true, broadcaster };
  } catch (error) {
    const apiError = error as APIError;

    // Audit log the failed update
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_updated',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        resource_id: id,
        request_method: 'PATCH',
        request_path: `/broadcasters/${id}`,
        outcome: 'failure',
        failure_reason: apiError.detail || 'Failed to update broadcaster',
        metadata: {
          user_name: user?.name,
          updated_fields: Object.keys(data),
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster update failure:', auditError);
    }

    return { success: false, error: apiError.detail || 'Failed to update broadcaster' };
  }
}

export async function deleteBroadcaster(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await getSessionUser();
  const client = getRescueStreamClient();

  try {
    await client.deleteBroadcaster(id);

    // Audit log the successful deletion
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_deleted',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        resource_id: id,
        request_method: 'DELETE',
        request_path: `/broadcasters/${id}`,
        outcome: 'success',
        metadata: {
          user_name: user?.name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster deletion:', auditError);
    }

    revalidatePath('/broadcasters');
    return { success: true };
  } catch (error) {
    const apiError = error as APIError;

    // Audit log the failed deletion
    try {
      await client.createAuditLog({
        event_type: 'broadcaster_deleted',
        actor: user?.email || 'unknown',
        resource_type: 'broadcaster',
        resource_id: id,
        request_method: 'DELETE',
        request_path: `/broadcasters/${id}`,
        outcome: 'failure',
        failure_reason: apiError.detail || 'Failed to delete broadcaster',
        metadata: {
          user_name: user?.name,
        },
      });
    } catch (auditError) {
      console.error('Failed to create audit log for broadcaster deletion failure:', auditError);
    }

    return { success: false, error: apiError.detail || 'Failed to delete broadcaster' };
  }
}
