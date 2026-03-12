export const HEIGHT_OPTIONS = Array.from({ length: 20 }, (_, i) => {
  const inches = 58 + i; // 4'10" is 58 inches
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
});

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export const COMPLEXION_OPTIONS = ["Fair", "Medium", "Dark"];
export const EMPLOYMENT_TYPES = ["Private", "Govt", "Business", "Freelancer", "Other"];
export const FAMILY_STATUS_OPTIONS = ["Nuclear Family", "Joint Family", "Middle Class", "Upper Middle Class", "Affluent"];
export const MARITAL_STATUS_OPTIONS = ["Unmarried", "Divorced", "Widow/Widower"];
export const RELIGION_OPTIONS = ["Islam", "Hinduism", "Christianity", "Buddhism", "Other"];
