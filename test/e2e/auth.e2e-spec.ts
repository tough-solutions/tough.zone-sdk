import * as dotenv from "dotenv";
import { ToughZone } from "../../src";

dotenv.config();

describe("ToughZone.Auth", () => {
    it("should resolve with valid token", () => expect(ToughZone.Auth.getToken()).resolves.toBeTruthy());
});
