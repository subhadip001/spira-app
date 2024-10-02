import { FormSchema } from "@/types/FormSchema";

export const devopsForm: FormSchema = {
  title: "DevOps Engineer Application Form",
  description:
    "Please provide the following information to apply for the DevOps Engineer position.",
  headerBackground: "#ffffff",
  fields: [
    {
      constantId: 1,
      serialId: 1,
      type: "text",
      label: "Full Name",
      name: "fullName",
      required: true,
    },
    {
      constantId: 2,
      serialId: 2,
      type: "email",
      label: "Email Address",
      name: "email",
      required: true,
    },
    {
      constantId: 3,
      serialId: 3,
      type: "tel",
      label: "Phone Number",
      name: "phoneNumber",
      required: true,
    },
    {
      constantId: 4,
      serialId: 4,
      type: "textarea",
      label: "Resume (upload or paste text)",
      name: "resume",
      required: true,
    },
    {
      constantId: 5,
      serialId: 5,
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
      constantId: 6,
      serialId: 6,
      type: "checkbox",
      label: "Have you worked with containerization tools (e.g., Docker)?",
      name: "containerizationExperience",
      required: true,
    },
    {
      constantId: 7,
      serialId: 7,
      type: "checkbox",
      label:
        "Have you worked with cloud platforms (e.g., AWS, Azure, Google Cloud)?",
      name: "cloudExperience",
      required: true,
    },
    {
      constantId: 8,
      serialId: 8,
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
      constantId: 9,
      serialId: 9,
      type: "range",
      label:
        "How many years of experience do you have in software development?",
      name: "softwareDevelopmentExperience",
      min: 0,
      max: 20,
      step: 1,
      required: true,
    },
    {
      constantId: 10,
      serialId: 10,
      type: "file",
      label: "Resume",
      name: "resume",
      required: false,
      accept: ".pdf,.doc,.docx",
      maxSize: "5242880",
    },
  ],
};
