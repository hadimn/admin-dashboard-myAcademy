export interface badge {
  badge_id: number;
  name: string;
  description: string;
  icon?: string;
  type: string;
  criteria: Record<string,any>;
  points: number;
}
