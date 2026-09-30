// These option lists and field definitions mirror the trained model artifacts
// in ml/models/*.joblib exactly, so every request this UI sends is one the
// backend can actually score. If the models are retrained with new
// categories, update the lists below to match.

export const RETENTION_FIELD_GROUPS = [
  {
    id: "personal",
    title: "Personal details",
    fields: [
      { name: "Age", label: "Age", type: "number", min: 18, max: 70, placeholder: "34" },
      { name: "Gender", label: "Gender", type: "select", options: ["Female", "Male"] },
      { name: "Marital Status", label: "Marital status", type: "select", options: ["Single", "Married", "Divorced"] },
      { name: "Number of Dependents", label: "Dependents", type: "number", min: 0, max: 10, placeholder: "2" },
    ],
  },
  {
    id: "role",
    title: "Role & tenure",
    fields: [
      { name: "Job Role", label: "Job role", type: "select", options: ["Technology", "Finance", "Healthcare", "Education", "Media"] },
      { name: "Job Level", label: "Job level", type: "select", options: ["Entry", "Mid", "Senior"] },
      { name: "Years at Company", label: "Years at company", type: "number", min: 0, max: 45, placeholder: "4" },
      { name: "Company Tenure (In Months)", label: "Company tenure (months)", type: "number", min: 0, max: 540, placeholder: "48" },
      { name: "Company Size", label: "Company size", type: "select", options: ["Small", "Medium", "Large"] },
      { name: "Distance from Home", label: "Distance from home (km)", type: "number", min: 0, max: 200, placeholder: "12" },
      { name: "Overtime", label: "Works overtime", type: "select", options: ["No", "Yes"] },
      { name: "Remote Work", label: "Remote work", type: "select", options: ["No", "Yes"] },
    ],
  },
  {
    id: "growth",
    title: "Compensation & growth",
    fields: [
      { name: "Monthly Income", label: "Monthly income (₹)", type: "number", min: 0, max: 1000000, placeholder: "55000" },
      { name: "Number of Promotions", label: "Promotions received", type: "number", min: 0, max: 10, placeholder: "1" },
      { name: "Education Level", label: "Education level", type: "select", options: ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD"] },
      { name: "Leadership Opportunities", label: "Leadership opportunities offered", type: "select", options: ["No", "Yes"] },
      { name: "Innovation Opportunities", label: "Innovation opportunities offered", type: "select", options: ["No", "Yes"] },
    ],
  },
  {
    id: "sentiment",
    title: "Sentiment & standing",
    fields: [
      { name: "Work-Life Balance", label: "Work-life balance", type: "select", options: ["Poor", "Fair", "Good", "Excellent"] },
      { name: "Job Satisfaction", label: "Job satisfaction", type: "select", options: ["Low", "Medium", "High", "Very High"] },
      { name: "Performance Rating", label: "Performance rating", type: "select", options: ["Low", "Below Average", "Average", "High"] },
      { name: "Company Reputation", label: "Company reputation", type: "select", options: ["Poor", "Fair", "Good", "Excellent"] },
      { name: "Employee Recognition", label: "Employee recognition", type: "select", options: ["Low", "Medium", "High", "Very High"] },
    ],
  },
];

// A filled-in example a judge/demo user can load with one click.
export const RETENTION_SAMPLE = {
  Age: 29,
  Gender: "Female",
  "Marital Status": "Single",
  "Number of Dependents": 0,
  "Job Role": "Technology",
  "Job Level": "Entry",
  "Years at Company": 2,
  "Company Tenure (In Months)": 24,
  "Company Size": "Medium",
  "Distance from Home": 18,
  Overtime: "Yes",
  "Remote Work": "No",
  "Monthly Income": 42000,
  "Number of Promotions": 0,
  "Education Level": "Bachelor's Degree",
  "Leadership Opportunities": "No",
  "Innovation Opportunities": "No",
  "Work-Life Balance": "Poor",
  "Job Satisfaction": "Low",
  "Performance Rating": "Average",
  "Company Reputation": "Fair",
  "Employee Recognition": "Low",
};

export const JOB_TITLES = [
  "Account Director", "Account Executive", "Account Manager", "Accountant", "Administrative Assistant",
  "Aerospace Engineer", "Architect", "Architectural Designer", "Art Director", "Art Teacher",
  "Back-End Developer", "Brand Ambassador", "Brand Manager", "Business Analyst", "Business Development Manager",
  "Chemical Analyst", "Chemical Engineer", "Civil Engineer", "Content Writer", "Copywriter",
  "Customer Service Manager", "Customer Service Representative", "Customer Success Manager", "Customer Support Specialist",
  "Data Analyst", "Data Engineer", "Data Entry Clerk", "Data Scientist", "Database Administrator", "Database Developer",
  "Dental Hygienist", "Digital Marketing Specialist", "Electrical Designer", "Electrical Engineer",
  "Email Marketing Specialist", "Environmental Consultant", "Environmental Engineer", "Event Coordinator",
  "Event Manager", "Event Planner", "Executive Assistant", "Family Lawyer", "Family Nurse Practitioner",
  "Finance Manager", "Financial Advisor", "Financial Analyst", "Financial Controller", "Financial Planner",
  "Front-End Developer", "Front-End Engineer", "Graphic Designer", "HR Coordinator", "HR Generalist", "HR Manager",
  "Human Resources Manager", "IT Administrator", "IT Manager", "IT Support Specialist", "Interior Designer",
  "Inventory Analyst", "Investment Advisor", "Investment Analyst", "Investment Banker", "Java Developer",
  "Key Account Manager", "Landscape Architect", "Landscape Designer", "Legal Advisor", "Legal Assistant",
  "Legal Counsel", "Legal Secretary", "Litigation Attorney", "Market Analyst", "Market Research Analyst",
  "Marketing Analyst", "Marketing Coordinator", "Marketing Director", "Marketing Manager", "Marketing Specialist",
  "Mechanical Designer", "Mechanical Engineer", "Network Administrator", "Network Analyst", "Network Engineer",
  "Network Security Specialist", "Network Technician", "Nurse Manager", "Nurse Practitioner", "Occupational Therapist",
  "Office Manager", "Operations Manager", "Paralegal", "Pediatrician", "Personal Assistant",
  "Pharmaceutical Sales Representative", "Physical Therapist", "Physician Assistant", "Process Engineer",
  "Procurement Coordinator", "Procurement Manager", "Procurement Specialist", "Product Designer", "Product Manager",
  "Project Coordinator", "Project Manager", "Psychologist", "Public Relations Specialist", "Purchasing Agent",
  "QA Analyst", "QA Engineer", "Quality Assurance Analyst", "Registered Nurse", "Research Analyst",
  "Research Scientist", "SEM Specialist", "SEO Analyst", "SEO Specialist", "Sales Associate", "Sales Consultant",
  "Sales Manager", "Sales Representative", "Social Media Coordinator", "Social Media Manager", "Social Worker",
  "Software Architect", "Software Developer", "Software Engineer", "Software Tester", "Speech Therapist",
  "Structural Engineer", "Substance Abuse Counselor", "Supply Chain Analyst", "Supply Chain Manager",
  "Systems Administrator", "Systems Analyst", "Systems Engineer", "Tax Consultant", "Teacher", "Technical Writer",
  "UI Developer", "UX Researcher", "UX/UI Designer", "Urban Planner", "Veterinarian", "Web Designer",
  "Web Developer", "Wedding Planner",
];

export const EMPLOYMENT_GROUPINGS = [
  { key: "none", label: "National overview", filterField: null },
  { key: "state", label: "By state / UT", filterField: "state" },
  { key: "scheme", label: "By scheme", filterField: "scheme" },
  { key: "component", label: "By component", filterField: "component" },
  { key: "training_type", label: "By training type", filterField: "training_type" },
];

export const EMPLOYMENT_FILTER_VALUES = {
  state: [
    "Andaman And Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
    "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu And Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "The Dadra And Nagar Haveli And Daman And Diu", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  ],
  scheme: ["PMKVY 2.0", "PMKVY 3.0"],
  component: ["CSCM", "CSSM"],
  training_type: ["RPL", "SP", "STT"],
};

export const MEASURE_LABELS = {
  Enrolled: "Enrolled",
  Trained: "Trained",
  Assessed: "Assessed",
  Certified: "Certified",
  "Reported Placed": "Placed",
};

export const RATE_LABELS = {
  training_rate: "Training completion",
  assessment_rate: "Assessment",
  certification_rate: "Certification",
  placement_rate: "Placement",
  pipeline_dropoff_rate: "Pipeline drop-off",
  program_effectiveness_score: "Program effectiveness",
};
