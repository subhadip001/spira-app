export const devopsForm = {
  title: "DevOps Engineer Application Form",
  description:
    "Please provide the following information to apply for the DevOps Engineer position.",
  fields: [
    {
      type: "text",
      label: "Full Name",
      name: "fullName",
      required: true,
    },
    {
      type: "email",
      label: "Email Address",
      name: "email",
      required: true,
    },
    {
      type: "tel",
      label: "Phone Number",
      name: "phoneNumber",
      required: true,
    },
    {
      type: "textarea",
      label: "Resume (upload or paste text)",
      name: "resume",
      required: true,
    },
    {
      type: "select",
      label: "Preferred Programming Language",
      name: "preferredLanguage",
      options: [
        {
          label: "Java",
          value: "java",
        },
        {
          label: "Python",
          value: "python",
        },
        {
          label: "C++",
          value: "cpp",
        },
        {
          label: "Other (please specify)",
          value: "other",
        },
      ],
      required: true,
    },
    {
      type: "checkbox",
      label: "Have you worked with containerization tools (e.g., Docker)?",
      name: "containerizationExperience",
      required: true,
    },
    {
      type: "checkbox",
      label:
        "Have you worked with cloud platforms (e.g., AWS, Azure, Google Cloud)?",
      name: "cloudExperience",
      required: true,
    },
    {
      type: "radio",
      label: "What is your level of experience with DevOps tools?",
      name: "devOpsExperience",
      options: [
        {
          label: "Beginner",
          value: "beginner",
        },
        {
          label: "Intermediate",
          value: "intermediate",
        },
        {
          label: "Advanced",
          value: "advanced",
        },
      ],
      required: true,
    },
    {
      type: "range",
      label:
        "How many years of experience do you have in software development?",
      name: "softwareDevelopmentExperience",
      min: 0,
      max: 20,
      step: 1,
      required: true,
    },
  ],
};
