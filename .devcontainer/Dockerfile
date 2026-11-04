
# Node.js development environment
FROM mcr.microsoft.com/devcontainers/javascript-node:4-24-bookworm

# Install CLI tools under the non-root user
USER node

ENV HOME=/home/node
ENV PATH="/home/node/.local/bin:${PATH}"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install Claude Code (native installer)
RUN curl -fsSL https://claude.ai/install.sh | bash

# Install OpenAI Codex (native installer)
RUN curl -fsSL https://chatgpt.com/codex/install.sh | CODEX_NON_INTERACTIVE=1 sh

# Verify both installations
RUN claude --version && codex --version
