export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
