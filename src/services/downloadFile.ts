export const DownloadFile = (filename: string, text: string) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
export const DownloadCSVFile = (filename: string, text: string) => {

  var csvString = "ı,ü,ü,ğ,ş,#Hashtag,ä,ö";
  const universalBOM = "\uFEFF";
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv; charset=utf-8," + encodeURIComponent(universalBOM + text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
