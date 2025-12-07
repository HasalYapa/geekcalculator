import { createNextJSHandler } from '@genkit-ai/next';
import { ai } from '@/ai/genkit';
import '@/ai/dev';

export const { GET, POST } = createNextJSHandler({
  ai,
  // You can configure your flow authorization and CORS policies here.
  // GKE and Cloud Run users should configure CORS via their frontend framework.
  // All other users can configure CORS here.
  // cors: {
  //   origin: '*', // or a more restrictive origin
  // },
  // auth: async (auth, flow) => {
  //   // Implement your authorization logic here.
  //   // An empty block means no authorization is required.
  // },
});
