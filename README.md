# Remotion Mapbox example

https://user-images.githubusercontent.com/1629785/233837028-8ce3dd74-f10a-4b2f-8005-4da04ca3ab18.mp4

This example allows you to animate a route using Mapbox and export it as an MP4 using Remotion. You need a Mapbox API key, which is free though.

## Special considerations for using Remotion with Mapbox

- Since rendering happens on multiple cores, more Mapbox initializations may be charged to your Mapbox account.
- Mapbox has label transitions that cannot be controlled using [`useCurrentFrame()`](https://www.remotion.dev/docs/use-current-frame) - therefore they have been disabled.
- Having no transitions causes certain elements like terrain data and POI markers to not be animated nicely - therefore those have been disabled in the style.
- Since it [uses the GPU](https://www.remotion.dev/docs/gpu), the `angle` rendering mode has been enabled in the config file.
- If you want to render this video on Lambda, it will be slower because Lambda has no GPU.

## Mapbox style

You can copy the mapbox style from here: https://api.mapbox.com/styles/v1/jonnyburger/clgtb8stl002z01o5d15ye0u0.html?title=copy&access_token=pk.eyJ1Ijoiam9ubnlidXJnZXIiLCJhIjoiY2xndDg3Y3lmMjFsazNrbW0zdWEzOTVpbSJ9.S40QeakLmFuEyxi8MBMczg&zoomwheel=true&fresh=true#14.09/42.69864/9.45602

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

Rename `.env.example` to `.env` and add an API key that you get through `https://account.mapbox.com`

```console
npm start
```

**Render video**

```console
npm run build
```

**Upgrade Remotion**

```console
npm run upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help [on our Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Notice that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
