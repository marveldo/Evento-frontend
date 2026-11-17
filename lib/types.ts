export interface Tag {
  id: string;
  tag_name: string | null;
}

export interface Host {
  id: string;
  full_name: string | null;
  email: string;
  profile_img: string;
}

export interface EventItem {
  id: string;
  event_name: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  start_date: string | null;
  start_time: string | null;
  price: number | null;
  capacity: number | null;
  location: string | null;
  event_image: string | null;
  category: Tag[];
  hosted_by: Partial<Host>;
  event_link: string;
}

export interface User {
  id: string;
  full_name: string | null;
  email: string;
  profile_img: string;
  upcoming_events_count: number;
  past_events_count: number;
  created_events_count: number;
  upcoming_events: EventItem[];
  location: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  bio: string | null;
  device_id?: string;
}

export interface Device {
  id: string;
  ip_address: string | null;
  device_name: string | null;
  device_os: string | null;
  device_type: "Mobile" | "Tablet" | "PC" | null;
  user: string;
}

export interface Page<T> {
  count: number;
  limit: number;
  offset: number;
  total_pages: number;
  data: T[];
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string;
  deviceId: string;
}

export interface Session {
  user: SessionUser;
  accessExpiresAt: number;
}

export type PhotoKind = "profile" | "event";

export interface PhotoSignature {
  upload_url: string;
  public_id: string;
  kind: PhotoKind;
  fields: Record<string, string>;
}

export interface FieldError {
  field: string;
  message: string;
}

// A notification pushed live over the notifications stream.
export interface Notification {
  detail: string;
  message: string;
}

// A saved notification, from GET /notifications/. created_at is ISO 8601 UTC.
export interface NotificationItem {
  id: number;
  message: string;
  created_at: string;
}
