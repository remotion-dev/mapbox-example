import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Set this to swiftshader when rendering on Lambda
Config.setChromiumOpenGlRenderer('angle');
