export const handler = async (event) => {
  const qs = event.queryStringParameters || {};

  const ALLOWED_OWNER = process.env.GITHUB_OWNER || "Natti94";
  const ALLOWED_REPO = process.env.GITHUB_REPO || "Quiz";

  if (
    (qs.owner && String(qs.owner) !== ALLOWED_OWNER) ||
    (qs.repo && String(qs.repo) !== ALLOWED_REPO)
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid repository",
        details: `This endpoint only allows ${ALLOWED_OWNER}/${ALLOWED_REPO}`,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const owner = ALLOWED_OWNER;
  const repo = ALLOWED_REPO;

  const page = Math.max(1, parseInt(qs.page, 10) || 1);
  const perPage = Math.max(1, Math.min(parseInt(qs.per_page, 10) || 5, 100));
  const fetchAll = false;
  const limit = qs.limit
    ? Math.max(1, Math.min(parseInt(qs.limit, 10), 5000))
    : undefined;

  const baseUrl =
    process.env.GITHUB_QUIZ_UPDATES_URL ||
    `https://api.github.com/repos/${ALLOWED_OWNER}/${ALLOWED_REPO}/commits`;

  try {
    const headers = {
      "User-Agent": "NetlifyFunction",
      Accept: "application/vnd.github+json",
    };
    const token =
      process.env.GITHUB_TOKEN ||
      process.env.GH_TOKEN ||
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const fetchPage = async (p) => {
      const url = `${baseUrl}?per_page=${perPage}&page=${p}`;
      const response = await fetch(url, { headers });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`GitHub API error: ${response.status} ${text}`);
      }
      return response.json();
    };

    let commits = [];
    let allData = [];
    if (fetchAll) {
      let p = page;
      while (true) {
        const batch = await fetchPage(p);
        if (!Array.isArray(batch) || batch.length === 0) break;
        allData.push(...batch);
        if (limit && allData.length >= limit) {
          allData = allData.slice(0, limit);
          break;
        }
        if (batch.length < perPage) break;
        p += 1;
        if (!limit && allData.length >= 1000) break;
      }
    } else {
      allData = await fetchPage(page);
    }
    commits = (allData || []).map((commit) => ({
      hash: commit.sha?.substring(0, 7),
      author: commit.commit?.author?.name || commit.author?.login || "Unknown",
      date: commit.commit?.author?.date,
      message: commit.commit?.message,
      url: commit.html_url,
      repository: `${owner}/${repo}`,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(commits),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to retrieve commits",
        details: err.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
