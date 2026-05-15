import { triggerN8nWebhook } from './n8n';

/**
 * Sends a notification via n8n webhook.
 * The actual WhatsApp messaging logic is now handled in n8n.
 */
export const sendWhatsAppNotification = async (
  vehicleId: string,
  type: 'vehicle registration' | 'mark as done' | 'partial payment' | 'full payment',
  extraData?: any
) => {
  console.log(`Triggering notification for ${type} via n8n...`);

  // Trigger n8n Webhook which handles the WhatsApp logic
  const success = await triggerN8nWebhook(vehicleId, type, extraData);

  if (!success) {
    console.error(`Failed to trigger n8n notification for ${type}`);
  }

  return success;
};


