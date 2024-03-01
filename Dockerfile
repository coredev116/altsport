ARG NODE_VARIANT=18-alpine3.16

# ---- Base ----
FROM node:${NODE_VARIANT} as base
WORKDIR /usr/src/app
ENV NODE_ENV development
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# ---- Prod Dependency Builder ----
FROM node:${NODE_VARIANT} as prodDependencyBase
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --omit=dev --ignore-scripts

# ---- Builder ----
FROM base as builder
WORKDIR /usr/src/app
COPY src src/
COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./
RUN npm run prebuild && npm run build

# ---- Aggregator ----
FROM node:${NODE_VARIANT} as aggregator
RUN apk add dumb-init
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY secret_manager_setup.sh ./
RUN ./secret_manager_setup.sh

FROM aggregator
ENV NODE_ENV production
COPY --from=prodDependencyBase /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=builder /usr/src/app /usr/src/app
COPY VERSION.txt entrypoint.sh package.json package-lock.json ./
COPY src/docs dist/docs
RUN chown -R node:node /usr/src/app
USER node
CMD ["/usr/src/app/entrypoint.sh"]