//! --------------------------------------------- CSV & JSON DOWNLOAD ---------------------------------------------
import { store } from "@/state/store";

const getCards = () => {
  const cards = store.getState().orange.cards;
  console.log(cards);
  if (cards.length === 0) {
    alert("No Card Found in the table. Please scrape the card first.");
    return false;
  }
  return cards;
};

const downloadFile = (blob: Blob, format: "json" | "csv" | "xml") => {
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];
  const fileName = `orange_${currentDateString}`;
  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a new anchor element to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${format}`;

  // Append the anchor to the body and trigger the download
  document.body.appendChild(a);
  a.click();

  // Cleanup by removing the anchor and revoking the URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function downloadCardsAsCsv() {
  const cards = getCards();
  if (!cards) return;
  // Define CSV headers
  const headers = ["Title", "Activity", "Address", "Map", "Email", "Phones"];

  // Convert cards data to CSV format
  const csvContent =
    headers.join(",") +
    "\n" +
    cards
      .map((card) =>
        card
          ? [
              card.message.title.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.message.category.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.message.adress.text.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.message.adress.link.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.message.email.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.message.phone instanceof Array
                ? card.message.phone
                    .map((phone) => phone.replace(/(\r\n|\n|\r|,)/gm, " "))
                    .join("/")
                : card.message.phone.replace(/(\r\n|\n|\r|,)/gm, " "),
            ]
              .map((value) => (value ? `"${value}"` : '""'))
              .join(",")
          : ""
      )
      .join("\n");
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv" });
  downloadFile(blob, "csv");
}

export function downloadCardsAsJson() {
  const cards = getCards();
  if (!cards) return;
  // Convert cards data to JSON format
  const jsonData = JSON.stringify(cards, null, 2);

  // Create a Blob containing the JSON data
  const blob = new Blob([jsonData], { type: "application/json" });
  downloadFile(blob, "json");
}

export function downloadCardsAsXml() {
  const cards = getCards();
  if (!cards) return;
  // Create XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<cards>
  ${cards
    .map(
      (card) => `
  <card>
      <title>${card.message.title}</title>
      <category>${card.message.category}</category>
      <address>
        <text>${card.message.adress.text}</text>
      </address>
      <email>${card.message.email}</email>
      <phones>${
        card.message.phone instanceof Array
          ? card.message.phone.map((phone) => `<tel>${phone}</tel>`).join("\n")
          : `<tel>${card.message.phone}</tel>`
      }</phones>
  </card>`
    )
    .join("\n")}
</cards>`;

  // Create a Blob containing the XML data
  const blob = new Blob([xmlContent], { type: "application/xml" });
  downloadFile(blob, "xml");
}
