const axios = require("axios");
import path from "path";
import { ApiClient, HelixStream } from "twitch";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import { SimpleAdapter, WebHookListener } from "twitch-webhooks";
import { NgrokAdapter } from "twitch-webhooks-ngrok";

require("dotenv").config({ path: path.join(__dirname, "../.env") });

module.exports = async (nodecg) => {
  const clientId = process.env.TWITCH_CLIENT_ID as string;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET as string;

  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );
  const apiClient = new ApiClient({ authProvider });

  const listener = new WebHookListener(apiClient, new NgrokAdapter());
  const userId = process.env.TWITCH_USER_ID;
  const twitchFollowerReplicant = nodecg.Replicant("follower-alert");
  await listener.subscribeToFollowsToUser(userId, async (helixFollow) => {
    nodecg.log.info(`${helixFollow.userDisplayName} started following!`);
    twitchFollowerReplicant.value = helixFollow.userDisplayName;
  });

  await listener.listen();

  // const userId = process.env.TWITCH_USER_ID;

  const githubResultsReplicant = nodecg.Replicant("github-results");

  nodecg.listenFor("findRepositories", async (query) => {
    nodecg.log.info(`Extension received the value ${query}!`);

    try {
      const apiResponse = await axios.get(
        "https://api.github.com/search/repositories",
        {
          params: {
            q: query,
          },
        }
      );

      nodecg.log.info(
        `Found ${apiResponse.data.total_count} results from the github api!`
      );

      githubResultsReplicant.value = apiResponse.data.items;
    } catch (error) {
      nodecg.log.error(error);
    }
  });
};
