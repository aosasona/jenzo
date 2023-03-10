# Jenzo

Generate meta images for your web pages on the fly with HTML templates.

# Requirements

Jenzo will run on a lot of machines either using Docker or Node, but you might want/need to have these installed depending on how you want to run it:

- Chromium (the Docker file already includes this)
- Node (if you are not using Docker)
- Docker (if you want to run it via Docker; recommended)

> There is a known issue with the current Docker specification not working on ARM machines, you could modify it to download an ARM version of Chromium instead

# Running Jenzo

## Running locally

You can run Jenzo locally on your machine by running the following commands:

```bash
yarn install
PORT=8080 yarn dev
```

By default, Jenzo will run on port 80, you can either pass in the PORT like this or include it in your ENV file, check the [.env.example](./.env.example) for supported environment variables.

## Running in Docker

You can simply use the included docker-compose file to start with Docker compose:

```bash
docker compose up
```

Or you can build the image and run it

```bash
docker build -t jenzo .
docker run -it jenzo
```

# Environment

`PORT`: specifies the port you want Jenzo to run on

`ADDR`: specifies the address you want Jenzo to run on, this is usually just _localhost_ or _127.0.0.1_, but the default is _0.0.0.0_ for [Docker support](https://serverfault.com/questions/1084915/still-confused-why-docker-works-when-you-make-a-process-listen-to-0-0-0-0-but-no).

`CACHE_TTL`: specifies how long you want images to be cached in minutes (recommended is 3 if you are more likely to be updating templates often) - the cache drastically reduces response time, but it could also result in getting stale data after updating a template if you set it too high.

`ALLOWED_HOSTS`: comma-separated host URLs you want to allow requests from (enforced via CORS)

`VERSION`: this is just used to determine the API endpoint (api/v(version), eg. api/v1)

# Variables

Jenzo allows you to pass variables to your templates dynamically in the query parameter. Variables are defined in the following format:

```
vars=key:value
```

## Templating (with example)

Jenzo allows you to combine variants (HTML) with styles (CSS) in any way you want; as long as you have predefined them, and use variables in those combined templates.

Here is a sample URL including variables (name, title and fontsize), a variant (HTML), a style (CSS) and a size (this takes `small` or `large`):

```
http://localhost/api/v1/images/mono/preview?vars=name:John+Doe,title:Preview+Image,fontsize:3rem&size=small
```

Here is an example in Javascript using the `qs` library:

```js
const query = qs.stringify({
  variant: "blog",
  style: "blog",
  vars: `title:${title},date:${date}`,
});
const metaUrl = `https://mysite.com/api/v1/images/mysite/preview?${query}`;
```

The `POST` requests used to manage the templates are protected with an API key you set (you will get a warning on startup if you set none) and, can be found in the swagger documentation at `/docs` and templates can be changed on the fly (again, be careful with the CACHE_TTL you have set).
