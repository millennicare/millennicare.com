export interface IChild {
  name: string;
  age: number;
}

export interface IUser {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  // second step
  children: IChild[];
  // third step
  birthdate: Date;
  profilePicture?: string;
  biography?: string;
  userType: "careseeker" | "caregiver" | "admin";
  zipCode: string;
}

export interface FormProps {
  formValues: IUser;
  setFormValues: React.Dispatch<React.SetStateAction<IUser>>;
  handleBack: () => void;
  handleNext: () => void;
  step: number;
}
