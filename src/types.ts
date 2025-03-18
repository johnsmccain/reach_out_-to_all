export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  video_url?: string;
  imageUrl?: string;
  videoUrl?: string;
  type: "past" | "current" | "future";
}

export interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  request: string;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  message: string;
}

export interface SoulCount {
  id: string;
  count: number;
  lastUpdated: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  description: string;
  video_url: string;
  videoUrl: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  fileUrl: string;
  file_type: string;
  fileType: string;
  file_size: string;
  fileSize: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Statistics {
  id: string;
  states_covered: number;
  outreaches_conducted: number;
  locals_reached: number;
  communities_reached: number;
  souls_won: number;
  rededication_commitments: number;
  medical_beneficiaries: number;
  welfare_beneficiaries: number;
  updated_at: string;
}
