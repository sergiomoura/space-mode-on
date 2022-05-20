import type {Config} from '@jest/types';

let config:Config.InitialOptions = {
  verbose: true,
  testEnvironment:'jsdom',
  testEnvironmentOptions: {
    url: "http://localhost:8080/"
  },
  transform:{
    "^.+\\.ts$": "ts-jest"
  },
  roots: [
    "<rootDir>/src"
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
    "node"
  ],
  globals: {
    "ts-jest":{
      isolatedModules: true
    }
  }

}

export default config;