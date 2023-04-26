import {Config} from 'remotion';

Config.setImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Set this to swiftshader when rendering on Lambda
Config.setChromiumOpenGlRenderer('angle');
