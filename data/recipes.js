/*
  Recipes data. To add a recipe, copy one object and edit it.
  - id: unique English slug, used in the URL (recipe.html?id=...)
  - category: free text; tabs are generated automatically from all categories
  - added: YYYY-MM-DD, the newest recipe gets the "new" badge
  - ingredients: groups, each with an optional title and a list of items
*/
window.RECIPES = [
  {
    id: "baked-chicken-patties",
    title: "קציצות עוף אפויות עם ירקות",
    category: "עיקריות",
    prepTime: "15 דק׳",
    cookTime: "25–30 דק׳",
    totalMinutes: 45,
    added: "2026-11-13",
    source: { url: "https://www.instagram.com/reel/DKjKcMcIbqh/", label: "אינסטגרם" },
    ingredients: [
      {
        title: "לקציצות",
        items: [
          "500 גרם פרגית טחונה",
          "קישוא קטן, מגורד",
          "גזר קטן, מגורד",
          "3 שיני שום כתושות",
          "צרור כוסברה ופטרוזיליה, קצוצות",
          "ביצה אחת (L)",
          "¼ כוס פירורי לחם",
          "2 כפות סודה (מים מוגזים, לא סודה לשתייה)",
          "1 כף שמן זית",
          "½ כפית מלח",
          "½ כפית בהרט",
          "½ כפית שטוחה כמון"
        ]
      },
      {
        title: "להברשה",
        items: [
          "סילאן",
          "שמן זית"
        ]
      }
    ],
    steps: [
      "מחממים תנור ל-200 מעלות ומשמנים תבנית שמתאימה לתנור.",
      "מערבבים בקערה את כל מצרכי הקציצות עד לתערובת אחידה.",
      "יוצרים קציצות שמנמנות ומסדרים בתבנית.",
      "מערבבים בקערית סילאן עם שמן זית עד שהשמן נצבע, ומברישים כל קציצה – זה נותן צבע זהוב וקרמול עדין.",
      "אופים 25–30 דקות עד שהקציצות זהובות.",
      "מגישים כמו שהן או בתוך רוטב עגבניות. אפשר גם להקפיא אחרי האפייה ולהפשיר לפי הצורך."
    ]
  }
];
