

export function calculateReadingTime(content, wpm = 200) {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }

  // Strip HTML tags using regex
  const textOnly = content.replace(/<[^>]*>/g, ' ').trim();
  
  // Count words separated by whitespace
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  
  // Minimum 1 minute read
  const minutes = Math.max(1, Math.ceil(wordCount / wpm));
  
  return `${minutes} min read`;
}
