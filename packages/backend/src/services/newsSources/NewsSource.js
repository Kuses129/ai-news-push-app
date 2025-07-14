class NewsSource {
  constructor(name) {
    this.name = name;
  }

  // Should return an array of articles: [{title, content, link, publishedAt, source}]
  // lastTimestamp: optional ISO string of the last processed timestamp
  async fetchNews(lastTimestamp = null) {
    throw new Error('fetchNews(lastTimestamp) must be implemented by subclass');
  }
}

module.exports = NewsSource; 