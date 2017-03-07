var Dynamics;
(function (Dynamics) {
    var Crm;
    (function (Crm) {
        var UnitTests;
        (function (UnitTests) {
            "use strict";
            describe("Tasks.execute", function () {
                it("Returns empty array with null tasks", function () {
                    var results = Dynamics.Crm.Tasks.execute(null);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(0);
                });
                it("Returns empty array with undefined tasks", function () {
                    var results = Dynamics.Crm.Tasks.execute(undefined);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(0);
                });
                it("Force execute on all tasks", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; },
                        function () { counter++; return true; },
                        function () { counter++; throw new Error("Dummy error"); },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks, { executeAll: true, continueOnError: true });
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(tasks.length);
                    expect(counter).toEqual(tasks.length);
                });
                it("Stops on third tasks", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; },
                        function () { counter++; return true; },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(3);
                    expect(counter).toEqual(3);
                });
                it("Stops on first error", function () {
                    var counter = 0;
                    var tasks = [
                        function () { counter++; return false; },
                        function () { counter++; throw new Error("Dummy error"); },
                        function () { counter++; return false; }
                    ];
                    var results = Dynamics.Crm.Tasks.execute(tasks);
                    expect(results).not.toBeNull();
                    expect(results.length).toEqual(2);
                    expect(counter).toEqual(2);
                });
            });
        })(UnitTests = Crm.UnitTests || (Crm.UnitTests = {}));
    })(Crm = Dynamics.Crm || (Dynamics.Crm = {}));
})(Dynamics || (Dynamics = {}));
