import * as dotenv from "dotenv";
import { ToughZone } from "../../src";

dotenv.config();

describe("ToughZone.Tickets", () => {
    it("should resolve with ticket UUIDs", () => {
        expect.assertions(2);

        const promise = ToughZone.Tickets.createTickets(3);

        expect(promise).resolves.toBeTruthy();

        return promise.then((result) => expect(result.length).toBe(3));
    });

    it("should resolve with true", () =>
        ToughZone.Tickets.createTickets(3).then((tickets) =>
            expect(ToughZone.Tickets.deleteTickets(tickets)).resolves.toBe(true),
        ));
});
