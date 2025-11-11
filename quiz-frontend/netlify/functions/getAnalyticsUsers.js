export const handler = async (event, context) => {
  const qs = event.queryStringParameters || {};
  const GROK_API_KEY = process.env.GROK_API_KEY;


    if (!GROK_API_KEY) {

    const res  = 