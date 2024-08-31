export const sampleFormSchema = {
  title: "Frontend Developer Job Application",
  description:
    "Please fill out the form to apply for the Frontend Developer position.",
  fields: [
    // {
    //   type: "text",
    //   label: "Full Name",
    //   name: "fullName",
    //   placeholder: "Enter your full name",
    //   required: true,
    // },
    // {
    //   type: "email",
    //   label: "Email Address",
    //   name: "email",
    //   placeholder: "Enter your email address",
    //   required: true,
    // },
    // {
    //   type: "tel",
    //   label: "Phone Number",
    //   name: "phone",
    //   placeholder: "Enter your phone number",
    //   required: true,
    // },
    // {
    //   type: "text",
    //   label: "LinkedIn Profile",
    //   name: "linkedin",
    //   placeholder: "Enter your LinkedIn profile URL",
    //   required: false,
    // },
    // {
    //   type: "text",
    //   label: "GitHub Profile",
    //   name: "github",
    //   placeholder: "Enter your GitHub profile URL",
    //   required: false,
    // },
    // {
    //   type: "text",
    //   label: "Portfolio",
    //   name: "portfolio",
    //   placeholder: "Enter your portfolio URL",
    //   required: false,
    // },
    // {
    //   type: "textarea",
    //   label: "Summary",
    //   name: "summary",
    //   placeholder: "Briefly describe your experience and skills",
    //   required: true,
    // },
    // {
    //   type: "select",
    //   label: "Years of Experience",
    //   placeholder: "Select years of experience",
    //   name: "experience",
    //   options: [
    //     { label: "0-1 years", value: "0-1" },
    //     { label: "1-3 years", value: "1-3" },
    //     { label: "3-5 years", value: "3-5" },
    //     { label: "5+ years", value: "5+" },
    //   ],
    //   required: true,
    // },
    // {
    //   type: "checkbox",
    //   label: "Skills",
    //   name: "skills",
    //   options: [
    //     { label: "HTML", value: "html" },
    //     { label: "CSS", value: "css" },
    //     { label: "JavaScript", value: "javascript" },
    //     { label: "React", value: "react" },
    //     { label: "Angular", value: "angular" },
    //     { label: "Vue.js", value: "vuejs" },
    //     { label: "TypeScript", value: "typescript" },
    //     { label: "Sass", value: "sass" },
    //     { label: "Webpack", value: "webpack" },
    //     { label: "Git", value: "git" },
    //     { label: "Other", value: "other" },
    //   ],
    //   required: true,
    // },
    // {
    //   type: "checkbox",
    //   label: "Terms and Conditions",
    //   name: "terms",
    //   options: [
    //     {
    //       label: "I agree to the terms and conditions",
    //       value: "agree",
    //     },
    //   ],
    // },
    // {
    //   type: "radio",
    //   label: "Preferred Work Location",
    //   name: "workLocation",
    //   options: [
    //     { label: "Remote", value: "remote" },
    //     { label: "On-site", value: "onsite" },
    //     { label: "Hybrid", value: "hybrid" },
    //   ],
    //   required: true,
    // },
    // {
    //   type: "textarea",
    //   label: "Why do you want to work with us?",
    //   name: "reason",
    //   placeholder: "Explain your motivation to join our team",
    //   required: true,
    // },
    // {
    //   type: "range",
    //   label: "Salary Range",
    //   name: "salary",
    //   min: 0,
    //   max: 100000,
    //   step: 5000,
    //   required: true,
    // },
    {
      type: "file",
      label: "Resume",
      name: "resume",
      required: false,
      accept: ".pdf,.doc,.docx",
    },
    {
      type: "file",
      label: "Cover Letter",
      name: "coverLetter",
      required: false,
      accept: ".pdf,.doc,.docx",
    },
  ],
};
