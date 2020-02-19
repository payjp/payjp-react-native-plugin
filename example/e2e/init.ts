import { cleanup, init } from "detox";
const config = require("../package.json").detox;
import adapter from "detox/runners/jest/adapter";
import specReporter from "detox/runners/jest/specReporter";

// Set the default timeout
jest.setTimeout(120000);

jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

beforeAll(async () => {
    await init(config);
}, 300000);

beforeEach(async () => {
    await adapter.beforeEach();
});

afterAll(async () => {
    await adapter.afterAll();
    await cleanup();
});
