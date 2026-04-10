export const getViewerUrl = (url: string) => {
  if (!url) return "";

  const lower = url.toLowerCase();

  // PDF → direct
  if (lower.endsWith(".pdf")) {
    return url;
  }

  // DOC / DOCX / PPT / PPTX → Google viewer
  if (
    lower.endsWith(".doc") ||
    lower.endsWith(".docx") ||
    lower.endsWith(".ppt") ||
    lower.endsWith(".pptx")
  ) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;
  }

  return url;
};