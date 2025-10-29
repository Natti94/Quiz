const assetPaths = {
  projects_link: process.env.VITE_CLOUDINARY_PROJECTS_LINK,
  discord_icon: process.env.VITE_DISCORD_ICON,
  discord_link: process.env.VITE_DISCORD_LINK,
};

export async function handler(event) {
  const { asset } = event.queryStringParameters;

  if (!asset) {
    console.error("No asset parameter provided");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Asset parameter is required" }),
    };
  }

  const url = assetPaths[asset];
  if (!url) {
    console.error(
      `Asset '${asset}' not found or environment variable not set. Available assets: ${Object.keys(
        assetPaths,
      ).join(", ")}`,
    );
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Asset '${asset}' not found or environment variable not set. Available assets: ${Object.keys(
          assetPaths,
        ).join(", ")}`,
      }),
    };
  }

  console.log(`Redirecting to asset: ${url} for asset: ${asset}`);
  return {
    statusCode: 302,
    headers: {
      Location: url,
    },
    body: "",
  };
}
