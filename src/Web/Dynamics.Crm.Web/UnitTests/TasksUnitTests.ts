module Dynamics.Crm.UnitTests {

    "use strict";

    describe("Tasks.execute", () => {

        it("Returns empty array with null tasks", () => {

            var results = Dynamics.Crm.Tasks.execute(null);

            expect(results).not.toBeNull();
            expect(results.length).toEqual(0);
        });

        it("Returns empty array with undefined tasks", () => {

            var results = Dynamics.Crm.Tasks.execute(undefined);

            expect(results).not.toBeNull();
            expect(results.length).toEqual(0);
        });

        it("Force execute on all tasks", () => {

            var counter = 0;
            var tasks = <(() => boolean)[]>[
                () => { counter++; return false; },
                () => { counter++; },
                () => { counter++; return true; },
                () => { counter++; throw new Error("Dummy error"); },
                () => { counter++; return false; }
            ];
            var results = Dynamics.Crm.Tasks.execute(tasks, { executeAll: true, continueOnError: true });

            expect(results).not.toBeNull();
            expect(results.length).toEqual(tasks.length);
            expect(counter).toEqual(tasks.length);
        });

        it("Stops on third tasks", () => {

            var counter = 0;
            var tasks = <(() => boolean)[]>[
                () => { counter++; return false; },
                () => { counter++; },
                () => { counter++; return true; },
                () => { counter++; return false; }
            ];
            var results = Dynamics.Crm.Tasks.execute(tasks);

            expect(results).not.toBeNull();
            expect(results.length).toEqual(3);
            expect(counter).toEqual(3);
        });

        it("Stops on first error", () => {

            var counter = 0;
            var tasks = <(() => boolean)[]>[
                () => { counter++; return false; },
                () => { counter++; throw new Error("Dummy error"); },
                () => { counter++; return false; }
            ];
            var results = Dynamics.Crm.Tasks.execute(tasks);

            expect(results).not.toBeNull();
            expect(results.length).toEqual(2);
            expect(counter).toEqual(2);
        });
    });
}