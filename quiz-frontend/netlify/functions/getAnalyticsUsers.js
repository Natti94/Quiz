import { getDataStore } from "./_store";
const usersStore = getDataStore("analyticsUsers");

export async function handler(event, context) {
  try {
    const usersData = await usersStore.getJSON("users");
    return {
      statusCode: 200,
      body: JSON.stringify({ users: usersData || [] }),
    };
  } catch (error) {
    console.error("Error fetching analytics users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
