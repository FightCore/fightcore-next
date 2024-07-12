# FightCore

The repository for the [FightCore website](https://www.fightcore.gg). Made with
Next.Js, NextUI and Tailwind CSS.

## Running the project

Execute the following steps to install and launch FightCore for debugging:

- cd into the `website` folder.
- Run `npm install`
- Run `npm run dev`
- Open `http://localhost:3000`

## Building the project

> The current building process has case sensitive folder names to keep backwards
> compatibility with old FightCore routes. Due to this, the build process does
> NOT work on Windows.
> To build on Windows, please use the included Dockerfile.

On Linux run `npm run build` or use the Dockerfile `docker build ./website/ --tag fightcore/frontend`

There are two supported environment variables with this project:

- DO_TRACKING: Uses the [Umami](https://www.umami.is) privacy-aware tracking script.
- IS_BETA: Displays the Beta exclusive elements that should only be displayed on
  the [beta website](https://beta.fightcore.gg)

The tracking and beta toggles activate if there is any value rather than a `true` or `false`.
When contributing or developing, please ignore these flag.

> When using Docker to build, these can be passed as build-args.

## Hosting

The files are served on a Linux server within a docker container running nginx
using the files from the `proxy` folder. I'm not an expert on the hosting side
and will accept contributions.
