// English text of the course. Same ids as lessons.ts; icons and highlights come from the Hebrew modules.
// On-screen labels stay in Hebrew in the screenshots, so they are quoted in translation.
export interface EnStep { id: string; title: string; script: string; tip?: string; warning?: string }
export interface EnModule { id: string; title: string; intro?: string; steps: EnStep[] }

export const modulesEn: EnModule[] = [
  {
    id: "0",
    title: "Welcome",
    steps: [
      {
        id: "0.1",
        title: "Introduction",
        script: `Hello, I am Rivka Eliyahu from EPR's finance systems customer service, and I will guide you through viewing orders in the orders system. You will learn how to reach the search screen, filter by document type, date, status and supplier, read the results list, and open and print an order. You can replay an explanation or move on at any time.`,
      },
    ],
  },
  {
    id: "1",
    title: "Opening the search screen",
    intro: `We start with the screen where you find any order: Search and View Documents. Let's see how to get there and what it contains.`,
    steps: [
      {
        id: "1.1",
        title: "Opening the screen from the menu",
        script: `In the top ribbon, go to the Purchasing tab. On the right of the ribbon, click Search and View Documents. The Search and View Documents – Purchasing screen opens, and from it you can find any order in the system.`,
      },
      {
        id: "1.2",
        title: "Search criteria",
        script: `The top part of the screen is the Search Criteria area. Here you choose what to look for: document type, date range, document status, supplier, department and more. You don't have to fill in every field; fill in what you know and the system filters by it.`,
        tip: `The fewer fields you fill in, the more results you get.`,
      },
      {
        id: "1.3",
        title: "The results list",
        script: `Below the criteria is the results list. Each row is one document, such as an order, with its number, date, supplier, amount and current status. Every time you change the criteria and filter again, the list updates.`,
      },
    ],
  },
  {
    id: "2",
    title: "Searching and filtering",
    intro: `Now let's filter: choose a document type, a date range, a status and a supplier, then click Filter Results.`,
    steps: [
      {
        id: "2.1",
        title: "Document type",
        script: `In the Document Type field, open the list and choose Order. The list also has other types, such as tax invoice, price quote and delivery note, but to see orders, choose Order.`,
      },
      {
        id: "2.2",
        title: "Date range",
        script: `In the Document Date From and To fields, set the date range in which the order was created. If you are looking for an older order, move the start date back. You can also filter by Execution Date, in the row below.`,
        warning: `Can't find an order? Check the date range first. An order created before the start date will not appear in the list.`,
      },
      {
        id: "2.3",
        title: "Document status",
        script: `In the Document Status field, choose which stage the order is at, for example Request, Awaiting exception approval, Approved or Executed. To see all orders regardless of stage, choose All Orders.`,
      },
      {
        id: "2.4",
        title: "Searching by supplier",
        script: `To see only one supplier's orders, choose it in the Supplier field, or type the supplier number in the Supplier No. field. If you don't remember the exact name, double-click the supplier field and a search window opens.`,
      },
      {
        id: "2.5",
        title: "The card search window",
        script: `In the Card Search window, type part of the supplier's name in the Card Name field, or part of the business number, and click Search. Choose the supplier from the list and click Exit with Selection. The supplier is added to the criteria automatically.`,
        tip: `The Part of Name option finds the supplier even if you typed only one word of the name.`,
      },
      {
        id: "2.6",
        title: "Filter results",
        script: `Once you have filled in the criteria, click Filter Results. The results list updates and shows only the documents that match your search. In this example, only two orders remain.`,
      },
      {
        id: "2.7",
        title: "Clearing the screen",
        script: `To start a new search, click Clear Screen at the top of the screen. All the criteria reset, so you can choose them again without a previous filter affecting the results.`,
      },
    ],
  },
  {
    id: "3",
    title: "Reading the results list",
    intro: `We have a list. Now let's read it: what each column means, who needs to approve, and where to see the totals.`,
    steps: [
      {
        id: "3.1",
        title: "The columns",
        script: `Each row shows the order's serial number, document date, supplier number and name, Amount, and Not Supplied, the part not yet delivered. Further along the row are the department, details, contract number and budget items.`,
      },
      {
        id: "3.2",
        title: "Current status and next approver",
        script: `The Current Status column shows which stage the order is at, such as Request or Approved. The Next Approver column shows who needs to approve the order now, for example a manager. This tells you exactly where the order is waiting.`,
      },
      {
        id: "3.3",
        title: "Totals",
        script: `At the bottom of the list is a total for all the filtered orders: the overall amount, and next to it the amount not yet supplied. It is a quick way to see how much money your search covers.`,
      },
    ],
  },
  {
    id: "4",
    title: "Viewing an order",
    intro: `We found the order. Now let's open it and see all the details: the header, the lines, the budget and the attached documents.`,
    steps: [
      {
        id: "4.1",
        title: "Opening an order",
        script: `To open an order, double-click its number in the Serial No. column. The order opens in a new tab, and the search screen stays open behind it, so you can return to it at any time.`,
      },
      {
        id: "4.2",
        title: "Order details",
        script: `The top part, Order Details, shows the order number, date, supplier, the person who ordered and the department. On the left are the order status, payment terms and the total amount including VAT.`,
      },
      {
        id: "4.3",
        title: "Order lines",
        script: `In the middle of the screen are the order lines. Each line has an item description, unit, quantity, price, discount and amount, and on the left the budget item. This shows exactly what was ordered and for how much.`,
      },
      {
        id: "4.4",
        title: "Budget status",
        script: `At the bottom of the screen is the budget status of the selected item: annual budget, actual, requests and balance. If there isn't enough budget, a red bar with a warning appears and the order will need special approval.`,
        warning: `Warning: no budget available - the order will be approved through a special procedure only!`,
      },
      {
        id: "4.5",
        title: "Attached documents",
        script: `To see documents attached to the order, such as a price quote or an invoice, click the red Attached Documents button. In the results list too, the paperclip icon at the start of a row shows that documents are attached.`,
      },
    ],
  },
  {
    id: "5",
    title: "Printing and exporting",
    intro: `Finally, let's see how to mark orders, preview them before printing and export the list to Excel.`,
    steps: [
      {
        id: "5.1",
        title: "Marking orders",
        script: `In the Mark column, on the right of the list, tick the orders you want to print. You can tick several orders, or click Mark All at the top of the screen.`,
      },
      {
        id: "5.2",
        title: "Print preview",
        script: `After marking, click Print Preview on the left of the criteria area. The order form opens in a new tab, so you can check it before printing.`,
      },
      {
        id: "5.3",
        title: "The order form",
        script: `This is the order form as it will be sent to the supplier: order number, supplier details, items, amounts and notes to the supplier. An order that is not yet approved is marked Draft, Not Approved. From the top ribbon you can print it or save it as a PDF.`,
        tip: `Click Close Print Preview to return to the search screen.`,
      },
      {
        id: "5.4",
        title: "Export to Excel",
        script: `Want to work with the list outside the system? Click Export to Excel in the top ribbon, and the filtered list opens as an Excel file. That's it, we're done! You now know how to find any order and view it.`,
      },
    ],
  },
];
