export function formatCitations(text, style) {
  const citationRegex = {
    APA: /\(([A-Za-z]+,\s\d{4})\)/g,
    MLA: /Works Cited:\n([\s\S]+?)(?=\n\w)/i
  };
  return text.match(citationRegex[style]) || [];
}
