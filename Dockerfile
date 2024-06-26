FROM node:18

# ARGS
ARG NODE_ENV=${NODE_ENV}

ARG PORT=${PORT}

ARG ALLOWED_HOSTS=${ALLOWED_HOSTS}

ARG CACHE_TTL=${CACHE_TTL}

ARG API_KEY=${API_KEY}

# ENVs
ENV NODE_ENV=${NODE_ENV:-production}

ENV PORT=${PORT:-80}

ENV ALLOWED_HOSTS=${ALLOWED_HOSTS}

ENV CACHE_TTL=${CACHE_TTL:-1}

ENV API_KEY=${API_KEY}

ENV PUPPETEER_SKIP_DOWNLOAD true

WORKDIR /app

COPY yarn.lock package.json .

COPY tsconfig.json .

RUN apt-get update && apt-get install -y \
  chromium \
  libgconf-2-4 \
  libexif-dev \
  udev \
  && rm -rf /var/lib/apt/lists/*

# Uncomment this instead only if for some reason Chromium doesn't work, you will also need to edit the executablePath in src/modules/image.service.ts and delete the run command above
#
# RUN apt-get update && apt-get install -yq \
#   gconf-service \
#   libasound2 \
#   libatk1.0-0 \
#   libc6 \
#   libcairo2 \
#   libcups2 \
#   libdbus-1-3 \
#   libexpat1 \
#   libfontconfig1 \
#   libgbm1 \
#   libgcc1 \
#   libgconf-2-4 \
#   libgdk-pixbuf2.0-0 \
#   libglib2.0-0 \
#   libgtk-3-0 \
#   libnspr4 \
#   libpango-1.0-0 \
#   libpangocairo-1.0-0 \
#   libstdc++6 \
#   libx11-6 \
#   libx11-xcb1 \
#   libxcb1 \
#   libxcomposite1 \
#   libxcursor1 \
#   libxdamage1 \
#   libxext6 \
#   libxfixes3 \
#   libxi6 \
#   libxrandr2 \
#   libxrender1 \
#   libxss1 \
#   libxtst6 \
#   ca-certificates \
#   fonts-liberation \
#   libappindicator1 \
#   libnss3 \
#   lsb-release \
#   xdg-utils \
#   wget \
#   && rm -rf /var/lib/apt/lists/*

# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#   && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
#   && apt-get update && apt-get install -y google-chrome-stable

RUN yarn install

COPY ./src ./src

COPY ./data /app/data

RUN yarn run build

EXPOSE 80

CMD ["yarn", "start"]
