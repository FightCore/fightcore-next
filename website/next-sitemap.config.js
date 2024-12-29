/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.fightcore.gg',
  generateRobotsTxt: true,
  transform: async (config, path) => {
    // Use default transformation for all other cases
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: determinePriority(path),
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

determinePriority = (url) => {
  if (url.includes('moves')) {
    return 0.5;
  } else if (url === 'https://www.fightcore.gg/') {
    return 1;
  } else if (url.includes('credits')) {
    return 0.7;
  } else if (url.includes('crouch-cancel')) {
    return 0.7;
  }

  return 0.7;
};
