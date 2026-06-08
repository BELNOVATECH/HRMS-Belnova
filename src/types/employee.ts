import dayjs from "dayjs";

export interface Employee {
  id?: number;

  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;

  presentAddress?: string;
  permanentAddress?: string;
  fatherName?: string;

  bloodGroup?: number;
  gender?: number;
  maritalStatus?: number;

  // ✅ FIXED TYPE (NO null)
  dob?: string | dayjs.Dayjs;
  joinDate?: string | dayjs.Dayjs;
  probationEndDate?: string | dayjs.Dayjs;

  designation?: number;
  department?: number;
  employeeType?: number;
  manager?: number;
  role?: number;
  workLocation?: number;
  shift?: number;

  ctc?: number;
  salary?: number;

  bankAccount?: string;
  ifsc?: string;

  pan?: string;
  uan?: string;
  aadhar?: string;

  employeeId?: string;
  emergencyMobile?: string;
  referenceMobile?: string;

  photo?: string;
  familyMembers?: any[];
  status?: string;
}
