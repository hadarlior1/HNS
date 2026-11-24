// Knowledge check at the end of each module (modules 1–5; the welcome module has none).
// Every answer is taken from the step scripts in lessons.ts (`source` = the step it comes from).
export interface QuizQuestion {
  source: string; // step id, e.g. "4.5"
  he: { q: string; options: string[]; explain: string };
  en: { q: string; options: string[]; explain: string };
  answer: number; // index of the correct option (same order in he and en)
}

export const quiz: Record<string, QuizQuestion[]> = {
  "1": [
    {
      source: "1.1",
      he: {
        q: `איך מגיעים למסך "חיפוש והצגת מסמכים"?`,
        options: [
          `לשונית "רכש" בסרגל העליון, ואז "חיפוש והצגת מסמכים"`,
          `לשונית "דוחות", ואז "הזמנות"`,
          `לחיצה על לוגו EPR בראש המסך`,
        ],
        explain: `המסך נמצא בלשונית "רכש", בצד ימין של הסרגל העליון.`,
      },
      en: {
        q: `How do you reach the Search and View Documents screen?`,
        options: [
          `The Purchasing tab in the top ribbon, then Search and View Documents`,
          `The Reports tab, then Orders`,
          `Click the EPR logo at the top of the screen`,
        ],
        explain: `The screen is on the Purchasing tab, on the right of the top ribbon.`,
      },
      answer: 0,
    },
    {
      source: "1.2",
      he: {
        q: `האם חייבים למלא את כל השדות ב"קריטריונים לחיפוש"?`,
        options: [
          `כן, אחרת החיפוש לא יעבוד`,
          `לא, ממלאים רק את מה שיודעים והמערכת מסננת לפי זה`,
          `רק את שדה הספק חייבים למלא`,
        ],
        explain: `אפשר למלא רק חלק מהשדות. ככל שממלאים פחות שדות, מקבלים יותר תוצאות.`,
      },
      en: {
        q: `Do you have to fill in every field in the Search Criteria?`,
        options: [
          `Yes, otherwise the search won't work`,
          `No, fill in what you know and the system filters by it`,
          `Only the supplier field is required`,
        ],
        explain: `You can fill in only some of the fields. The fewer you fill in, the more results you get.`,
      },
      answer: 1,
    },
  ],
  "2": [
    {
      source: "2.2",
      he: {
        q: `חיפשתם הזמנה והיא לא מופיעה ברשימה. מה כדאי לבדוק קודם?`,
        options: [
          `את טווח התאריכים, אולי ההזמנה נוצרה לפני תאריך ההתחלה`,
          `לסגור את המערכת ולפתוח מחדש`,
          `לבקש מהספק לשלוח את ההזמנה שוב`,
        ],
        explain: `הזמנה שנוצרה לפני "תאריך מסמך מ" לא תופיע. הקדימו את תאריך ההתחלה.`,
      },
      en: {
        q: `You searched for an order and it isn't in the list. What should you check first?`,
        options: [
          `The date range: the order may have been created before the start date`,
          `Close the system and open it again`,
          `Ask the supplier to send the order again`,
        ],
        explain: `An order created before the From date won't appear. Move the start date back.`,
      },
      answer: 0,
    },
    {
      source: "2.7",
      he: {
        q: `איך מתחילים חיפוש חדש בלי שהסינון הקודם ישפיע?`,
        options: [
          `לוחצים "סינון תוצאות" פעמיים`,
          `לוחצים "נקה מסך" בראש המסך`,
          `מוחקים את רשימת התוצאות`,
        ],
        explain: `"נקה מסך" מאפס את כל הקריטריונים.`,
      },
      en: {
        q: `How do you start a new search without the previous filter affecting it?`,
        options: [
          `Click Filter Results twice`,
          `Click Clear Screen at the top of the screen`,
          `Delete the results list`,
        ],
        explain: `Clear Screen resets all the criteria.`,
      },
      answer: 1,
    },
  ],
  "3": [
    {
      source: "3.2",
      he: {
        q: `באיזו עמודה רואים אצל מי ההזמנה מחכה לאישור?`,
        options: [`"סכום"`, `"מחלקה"`, `"מאשר הבא"`],
        explain: `"מאשר הבא" מראה מי צריך לאשר את ההזמנה עכשיו.`,
      },
      en: {
        q: `Which column shows who the order is waiting for?`,
        options: [`Amount`, `Department`, `Next Approver`],
        explain: `Next Approver shows who needs to approve the order now.`,
      },
      answer: 2,
    },
    {
      source: "3.1",
      he: {
        q: `מה מציגה העמודה "לא סופק"?`,
        options: [
          `את החלק בהזמנה שעוד לא סופק`,
          `ספקים שלא קיבלו את ההזמנה`,
          `הזמנות שבוטלו`,
        ],
        explain: `"לא סופק" הוא החלק מסכום ההזמנה שעדיין לא סופק.`,
      },
      en: {
        q: `What does the Not Supplied column show?`,
        options: [
          `The part of the order not yet delivered`,
          `Suppliers who did not receive the order`,
          `Cancelled orders`,
        ],
        explain: `Not Supplied is the part of the order amount that hasn't been delivered yet.`,
      },
      answer: 0,
    },
  ],
  "4": [
    {
      source: "4.1",
      he: {
        q: `איך פותחים הזמנה מרשימת התוצאות?`,
        options: [
          `לחיצה כפולה על מספר ההזמנה`,
          `לחיצה על "ייצוא לאקסל"`,
          `סימון בעמודה "סמן"`,
        ],
        explain: `לחיצה כפולה על המספר פותחת את ההזמנה בלשונית חדשה.`,
      },
      en: {
        q: `How do you open an order from the results list?`,
        options: [`Double-click the order number`, `Click Export to Excel`, `Tick it in the Mark column`],
        explain: `Double-clicking the number opens the order in a new tab.`,
      },
      answer: 0,
    },
    {
      source: "4.5",
      he: {
        q: `איך רואים את המסמכים שצורפו להזמנה?`,
        options: [
          `בכפתור "מסמכים מצורפים" במסך ההזמנה`,
          `בשדה "פרטים"`,
          `בתצוגה לפני הדפסה בלבד`,
        ],
        explain: `הכפתור האדום "מסמכים מצורפים" מציג אותם. סמל האטב ברשימה מראה שיש מסמכים.`,
      },
      en: {
        q: `How do you see the documents attached to an order?`,
        options: [
          `With the Attached Documents button on the order screen`,
          `In the Details field`,
          `Only in print preview`,
        ],
        explain: `The red Attached Documents button shows them; the paperclip in the list shows there are documents.`,
      },
      answer: 0,
    },
  ],
  "5": [
    {
      source: "5.3",
      he: {
        q: `מה אומר הסימון "טיוטא, לא מאושר" על טופס ההזמנה?`,
        options: [
          `שההזמנה עדיין לא אושרה`,
          `שהספק דחה את ההזמנה`,
          `שההזמנה נמחקה`,
        ],
        explain: `הזמנה שעוד לא אושרה מודפסת עם הסימון "טיוטא, לא מאושר".`,
      },
      en: {
        q: `What does the Draft, Not Approved mark on the order form mean?`,
        options: [`The order isn't approved yet`, `The supplier rejected the order`, `The order was deleted`],
        explain: `An order that isn't approved yet prints with the Draft, Not Approved mark.`,
      },
      answer: 0,
    },
    {
      source: "5.4",
      he: {
        q: `איך מוציאים את רשימת ההזמנות שסיננתם לאקסל?`,
        options: [
          `"ייצוא לאקסל" בסרגל העליון`,
          `"תצוגה לפני הדפסה"`,
          `"נקה מסך"`,
        ],
        explain: `"ייצוא לאקסל" פותח את הרשימה שסיננתם כקובץ אקסל.`,
      },
      en: {
        q: `How do you export your filtered list of orders to Excel?`,
        options: [`Export to Excel in the top ribbon`, `Print Preview`, `Clear Screen`],
        explain: `Export to Excel opens the filtered list as an Excel file.`,
      },
      answer: 0,
    },
  ],
};
