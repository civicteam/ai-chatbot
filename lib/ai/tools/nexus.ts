import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { getTokens } from "@civic/auth/nextjs";
import { experimental_createMCPClient as createMCPClient } from "ai";

export const getNexusTools = async () => {
    const { accessToken } = (await getTokens()) ?? {};
    if (!accessToken) {
        throw new Error("No access token available for MCP client");
    }
    const transport = new StreamableHTTPClientTransport(
        new URL('https://nexus.civic.com/hub/mcp'), {
            requestInit: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        }
    );

    const mcpClient = await createMCPClient({ transport });
    return mcpClient.tools();
}
