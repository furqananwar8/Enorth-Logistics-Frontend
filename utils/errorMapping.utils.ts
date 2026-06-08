export const getErrors = (message: string) => {
  switch (message) {
    case "address_book_company_name_unique":
      return "Company name already exists, please add a unique company name.";
    case "address_book_phone_number_unique":
      return "Phone number already exists, please add a unique company name.";
    case "User not found":
      return "No user found with the provided details.";
    case "Unauthorized":
      return "You are not authorized to perform this action.";
    case "Network Error":
      return "Unable to connect to the server. Please try again.";
    default:
      return message || "Something went wrong.";
  }
};
