export interface Service {
  id: string;
  organization_id: string;
  name: string;
  price: number;
  image_url: string;
}

export interface Professional {
  id: string;
  organization_id: string;
  name: string;
  role: string;
  image_url: string;
}

export interface AppointmentWithDetails {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  appointment_date: string;
  appointment_time: string;
  status: 'confirmed' | 'cancelled';
  services: { name: string; price: number; };
  professionals: { name: string; };
}