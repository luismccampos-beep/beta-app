// ==========================================================================
// Core Newsletter Types
// ==========================================================================

export type NewsletterStatus =
  | 'draft'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'archived'
  | 'scheduled'
  | 'cancelled';

export type SubscriberStatus = 'active' | 'pending' | 'unsubscribed' | 'bounced';

// ==========================================================================
// Newsletter Campaign Interface
// ==========================================================================

/**
 * Newsletter campaign interface for managing email campaigns
 */
export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: NewsletterStatus;

  // Optional fields
  name?: string;
  title?: string;
  scheduledAt?: string | Date;
  sentAt?: string | Date;
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
  updatedAt: string;
  template?: string;
  templateId?: string;
  segments?: string[];
  language?: string;
  previewText?: string;

  // Legacy compatibility fields (snake_case)
  scheduled_at?: string;
  sent_at?: string;
  recipients_count?: number;
  open_rate?: number;
  click_rate?: number;
  created_at?: string;
  updated_at?: string;
  template_id?: string;
  preview_text?: string;
}

// ==========================================================================
// Newsletter Subscriber Interface
// ==========================================================================

/**
 * Newsletter subscriber interface for managing subscribers
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: SubscriberStatus;
  subscribedAt: string;
  tags: string[];

  // Optional fields
  name?: string;
  unsubscribedAt?: string;
  language?: string;
  source?: string;
  metadata?: Record<string, unknown>;

  // Legacy compatibility fields (snake_case)
  subscribed_at?: string;
  created_at?: string;
  updated_at?: string;
}


// ==========================================================================
// Confirmation Dialog Types
// ==========================================================================

export type ConfirmKind =
  | 'sendCampaign'
  | 'deleteCampaign'
  | 'deleteSubscriber'
  | 'bulkDelete'
  | 'bulkExport';

export interface ConfirmAction {
  kind: ConfirmKind;
  id?: string;
  ids?: string[];
  data?: Record<string, unknown>;
}
