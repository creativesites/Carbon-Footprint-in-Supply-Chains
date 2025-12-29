'use client';

import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="dashboard_assistant"
      properties={{
        userName: 'Demo User',
        userEmail: 'demo@cfip.com',
      }}
    >
      {children}
    </CopilotKit>
  );
}
