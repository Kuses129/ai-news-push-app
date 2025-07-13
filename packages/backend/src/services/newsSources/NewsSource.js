class NewsSource {
  constructor(name) {
    this.name = name;
  }

  // Should return an array of articles: [{title, content, link, publishedAt, source}]
  async fetchNews() {
    throw new Error('fetchNews() must be implemented by subclass');
  }
}

module.exports = NewsSource; 