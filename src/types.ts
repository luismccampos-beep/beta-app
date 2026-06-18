// Newsletter types
export type {
  NewsletterStatus,
  SubscriberStatus,
  NewsletterCampaign,
  NewsletterSubscriber as Subscriber
} from '../packages/shared/src/types/newsletters';

/** Shared filter option used by destination browse & travel preferences forms */
export type FilterOption = { name: string; count: number };

