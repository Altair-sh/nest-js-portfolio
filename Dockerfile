FROM node:26-alpine
WORKDIR /app
COPY . .
# build and remove dev dependencies in one step, 
# so deleted files don't stay in the image.
# 1. install packages exactly as in package-lock.json
# 2. build dist/
# 3. remove packages needed only for building
# 4. remove download caches
RUN npm ci \
    && npm run build \
    && npm prune --omit=dev \
    && npm cache clean --force \
    && rm -rf /root/.cache
# switch to non root user to run the app (is created in base image)
USER node
EXPOSE 3000
ENV NODE_ENV=production
# 1. create or update tables in db
# 2. drop data and fill db
# 3. start the app
CMD [ "/bin/sh" , "-c", "\
    npx prisma migrate deploy && \
    npx prisma db seed && \
    exec node --enable-source-maps dist/main.js\
"]
