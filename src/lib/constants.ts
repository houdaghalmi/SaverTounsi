export const TRANSACTION_CATEGORIES = [
    "Food",
    "Transportation",
    "Housing",
    "Utilities",
    "Healthcare",
    "Entertainment",
    "Shopping",
    "Education",
    "Savings",
    "Other",
  ] as const
  
  export const BON_PLAN_CATEGORIES = [
    "Groceries",
    "Electronics",
    "Fashion",
    "Restaurants",
    "Travel",
    "Services",
    "Home",
    "Beauty",
    "Sports",
    "Other",
  ] as const
  
  export const CHALLENGE_TYPES = [
    {
      id: "SAVINGS",
      name: "Savings Challenge",
      description: "Save a specific amount of money within a time period",
    },
    {
      id: "SPENDING_REDUCTION",
      name: "Spending Reduction",
      description: "Reduce spending in a specific category",
    },
    {
      id: "NO_SPEND",
      name: "No Spend Challenge",
      description: "Avoid unnecessary spending for a period",
    },
    {
      id: "CUSTOM",
      name: "Custom Challenge",
      description: "Create your own savings challenge",
    },
  ] as const
  
  export const SUPPORTED_LOCALES = {
    ar: "العربية",
    fr: "Français",
  } as const
  
  export const DEFAULT_LOCALE = "fr"
  
  export const CURRENCY = {
    code: "TND",
    symbol: "د.ت",
    name: "Tunisian Dinar",
  }