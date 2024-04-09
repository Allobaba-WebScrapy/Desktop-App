//! --------------------------------------------- HANDLE URLS FUNCTIONS ---------------------------------------------
/**
 * Converts a base URL into a perfect URL based on specific conditions.
 * @param base_url - The base URL to be converted.
 * @returns The perfect URL.
 */
export function makePerfectUrl(base_url: string): string {
  const parsed_url = new URL(base_url);
  let perfect_url: string;

  if (parsed_url.pathname === "/annuaire/chercherlespros") {
    const query_params = new URLSearchParams(parsed_url.search);
    const preserved_params: { [key: string]: string[] } = {};
    for (let key of query_params.keys()) {
      if (["quoiqui", "ou", "tri", "page"].includes(key)) {
        preserved_params[key] = query_params.getAll(key);
      }
    }
    parsed_url.search = new URLSearchParams(preserved_params as any).toString();
    perfect_url = parsed_url.toString();
  } else {
    const path_parts = parsed_url.pathname.split("/");
    const city =
      path_parts.length >= 3 ? path_parts[path_parts.length - 2] : null;
    const category =
      path_parts.length >= 2 ? path_parts[path_parts.length - 1] : null;
    const query_params = {
      quoiqui: category ? [category] : ["restaurants"],
      ou: city ? [city] : ["paris-75"],
    };
    parsed_url.pathname = "/annuaire/chercherlespros";
    parsed_url.search = new URLSearchParams(query_params as any).toString();
    perfect_url = parsed_url.toString();
  }

  return perfect_url;
}

/**
 * Adds query parameters to a base URL.
 * @param base_url - The base URL to which the query parameters will be added.
 * @param params - The query parameters to be added.
 * @returns The updated URL with added query parameters.
 */
export function addArgumentsToUrl(
  base_url: string,
  params: { [key: string]: string }
): string {
  const parsed_url = new URL(base_url);
  const query_params = new URLSearchParams(parsed_url.search);
  for (let key in params) {
    query_params.set(key, params[key]);
  }
  parsed_url.search = query_params.toString();
  return parsed_url.toString();
}

/**
 * Processes an array of base URLs and returns an array of updated URLs with query parameters.
 * @param baseUrls - An array of base URLs to be processed.
 * @returns An array of updated URLs with query parameters.
 */
export function processUrl(baseUrl: {
  url: string;
  params?: { [key: string]: string };
  endPage?: string;
  businessType?: string;
}): {
  url: string;
  startPage: number;
  endPage: number;
  businessType: string;
} {
  interface BaseUrl {
    url: string;
    startPage: number;
    endPage: number;
    businessType: string;
  }
  const url = baseUrl.url;
  const params = baseUrl.params || {};
  const startPage = params.startPage || "1";
  const tri = params.tri || "PERTINENCE-ASC";
  const endPage = baseUrl.endPage || "1";
  const businessType = baseUrl.businessType || "ALL";
  let updatedUrl: BaseUrl = {
    url: "",
    startPage: 1,
    endPage: 1,
    businessType: "ALL",
  };
  try {
    let perfectUrl = makePerfectUrl(url);
    if (!params && perfectUrl.includes("?")) {
      updatedUrl = {
        url: perfectUrl,
        startPage: parseInt(startPage),
        endPage: parseInt(endPage),
        businessType: businessType,
      };
    } else {
      updatedUrl = {
        url: addArgumentsToUrl(perfectUrl, {
          page: startPage,
          tri: tri,
        }),
        startPage: parseInt(startPage),
        endPage: parseInt(endPage),
        businessType: businessType,
      };
    }
  } catch (e) {
    console.error("Error In Process Url: ", e);
  }
  return updatedUrl;
}

//! --------------------------------------------- CSV & JSON DOWNLOAD ---------------------------------------------
import { store } from "@/state/store";

const getCards = () => {
  const cards = store.getState().pagesJaunes.cards;
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
  const fileName = `pagesJaunes_${currentDateString}`;
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
  const headers = ["Title", "Activity", "Address", "Phones", "Card URL"];

  // Convert cards data to CSV format
  const csvContent =
    headers.join(",") +
    "\n" +
    cards
      .map((card) =>
        card && card.info
          ? [
              card.info.title.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.info.activite.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.info.address.text.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.info.phones instanceof Array
                ? card.info.phones
                    .map((phone) => phone.replace(/(\r\n|\n|\r|,)/gm, " "))
                    .join("/")
                : card.info.phones.replace(/(\r\n|\n|\r|,)/gm, " "),
              card.card_url.replace(/(\r\n|\n|\r|,)/gm, " "),
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
    <card_id>${card.card_id}</card_id>
    <card_url>${card.card_url}</card_url>
    <info>
      <title>${card.info.title}</title>
      <activite>${card.info.activite}</activite>
      <address>${card.info.address}</address>
      <phones>${
        card.info.phones instanceof Array
          ? card.info.phones.map(phone => `<tel>${phone}</tel>`).join("\n")
          : `<tel>${card.info.phones}</tel>`
      }</phones>
    </info>
  </card>`
    )
    .join("\n")}
</cards>`;

  // Create a Blob containing the XML data
  const blob = new Blob([xmlContent], { type: "application/xml" });
  downloadFile(blob, "xml");
}
