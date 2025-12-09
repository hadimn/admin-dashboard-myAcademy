export interface Course {
  course_id: number;
  title: string;
  description: string;
  language: string;
  order: number;
  image_url?: string;
  video_url?: string;
  created_at: string;
} 

export type CourseWithAvatar = Course & {
  avatar: {
    src: string;
    alt: string;
  };
};