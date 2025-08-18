export const LessonStatus = {
  RESERVED: 'reserved',
  VERIFIED: 'verified',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];
export const lessonStatus = Object.values(LessonStatus);
